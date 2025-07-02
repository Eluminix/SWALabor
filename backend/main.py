import csv
import httpx
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔍 Hilfsfunktion zum Parsen einer Wahl-CSV
PARTEIEN_MAPPING = {
    "Christlich Demokratische Union Deutschlands": "CDU",
    "Christlich-Soziale Union in Bayern e.V." : "CDU",
    "Sozialdemokratische Partei Deutschlands": "SPD",
    "BÜNDNIS 90/DIE GRÜNEN": "GRÜNE",
    "Freie Demokratische Partei": "FDP",
    "Alternative für Deutschland": "AfD",
    "DIE LINKE": "Die Linke",
    "Die Linke.": "Die Linke",
    # Und direkt verwendbare:
    "CDU": "CDU",
    "SPD": "SPD",
    "GRÜNE": "GRÜNE",
    "FDP": "FDP",
    "AfD": "AfD",
    "Die Linke": "Die Linke"
}

WICHTIGE_PARTEIEN = {"CDU", "SPD", "GRÜNE", "FDP", "AfD", "Die Linke"}


def parse_format_2021(rows: list[list[str]]) -> Dict[str, float]:
    results = {}
    for row in rows[1:]:
        if len(row) >= 5 and row[0] and row[4]:
            partei_roh = row[0].strip()
            partei = PARTEIEN_MAPPING.get(partei_roh)
            if partei in WICHTIGE_PARTEIEN:
                try:
                    prozent = float(row[4].replace(",", "."))
                    results[partei] = round(prozent, 1)
                except ValueError:
                    continue
    return results



def parse_format_2025(rows: list[list[str]]) -> Dict[str, float]:
    results = {}
    for row in rows[5:]:
        if len(row) >= 2 and row[0] and row[1]:
            partei_roh = row[0].strip()
            partei = PARTEIEN_MAPPING.get(partei_roh)
            if partei in WICHTIGE_PARTEIEN:
                try:
                    prozent = float(row[1].replace(",", ".").replace("+", ""))
                    results[partei] = round(prozent, 1)
                except ValueError:
                    continue
    return results



def parse_election_csv(file_path: str) -> Dict[str, float]:
    with open(file_path, encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=";")
        rows = list(reader)

        if len(rows) < 2:
            return {}

        # Format erkennen (2025 enthält "Erststimmen" mehrfach in Zeile 1)
        joined_header = ";".join(rows[1])
        if "Erststimmen" in joined_header:
            return parse_format_2025(rows)
        else:
            return parse_format_2021(rows)

# 📡 API-Endpunkt zum Abrufen von Wahlergebnissen
@app.get("/election-results")
def get_results(
    state: str = Query(..., alias="state"),
    year: int = Query(..., alias="year")
):
    

    path = f"data/{year}/{state}_{year}.csv"

    if not os.path.exists(path):
        return {"error": "Keine Daten für dieses Bundesland und Jahr verfügbar."}

    results = parse_election_csv(path)
    return results if results else {"error": "Keine gültigen Wahldaten gefunden."}



@app.get("/")
def read_root():
    return {"message": "FastAPI läuft. Nutze /election-results?state=Bayern"}


@app.get("/historical-results")
def get_historical_results(state: str = Query(..., alias="state")):
    base_path = "data"
    result_map = {}

    for year in os.listdir(base_path):
        year_path = os.path.join(base_path, year)
        if not os.path.isdir(year_path):
            continue

        file_path = os.path.join(year_path, f"{state}_{year}.csv")
        if os.path.exists(file_path):
            parsed = parse_election_csv(file_path)
            if parsed:
                result_map[year] = parsed

    if not result_map:
        return {"error": "Keine historischen Daten für dieses Bundesland verfügbar."}

    print(result_map)
    return result_map




PARLIAMENT_PATHS = {
    "Bundestagswahl": "Bundestag",
    "Nordrhein-Westfalen": "Nordrhein-Westfalen_(NRW)",
    "Bayern": "Bayern",
    # ... weitere Landtage hier ergänzen ...
}

DAWUM_URL = "https://api.dawum.de/newest_surveys.json"

@app.get("/umfragen/neu")
async def get_umfragen(wahl: str = Query(None)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(DAWUM_URL)
            if response.status_code != 200:
                # Forward API error as our error
                return JSONResponse(
                    content={"umfragen": [], "error": f"API-Fehler {response.status_code}"},
                    status_code=500
                )
            data = response.json()
            if not isinstance(data, dict) or "Surveys" not in data:
                return JSONResponse(
                    content={"umfragen": [], "error": "Unerwartete Datenstruktur von der API"},
                    status_code=500
                )
            # Filter surveys by requested election if applicable
            target_ids = []
            if wahl:
                # Use mapping if available to handle special names (e.g. NRW)
                if wahl in PARLIAMENT_PATHS:
                    # e.g. "Bundestagswahl" -> "Bundestag", "Nordrhein-Westfalen" -> "Nordrhein-Westfalen_(NRW)"
                    search_key = PARLIAMENT_PATHS[wahl]
                    # Replace underscores with spaces to match JSON shortcuts (if any)
                    search_key = search_key.replace("_", " ")
                else:
                    search_key = wahl
                # Find all parliament IDs matching the election name or shortcut
                for pid, info in data.get("Parliaments", {}).items():
                    if (info.get("Election") == search_key or 
                        info.get("Name") == search_key or 
                        info.get("Shortcut") == search_key or 
                        info.get("Shortcut", "").startswith(search_key)):
                        target_ids.append(pid)
            
            # Build the list of surveys
            surveys = data["Surveys"]
            parliaments = data.get("Parliaments", {})
            institutes = data.get("Institutes", {})
            taskers = data.get("Taskers", {})
            methods = data.get("Methods", {})
            parties = data.get("Parties", {})
            umfragen_list = []

            for sid, survey in surveys.items():
                # If filtering by wahl, skip surveys not in target_ids
                if target_ids and survey.get("Parliament_ID") not in target_ids:
                    continue
                # Map IDs to names
                inst_name = institutes.get(survey["Institute_ID"], {}).get("Name", survey["Institute_ID"])
                auftr_name = taskers.get(survey["Tasker_ID"], {}).get("Name", survey["Tasker_ID"])
                method_name = methods.get(survey["Method_ID"], {}).get("Name", survey["Method_ID"])
                # Format date range
                period = survey.get("Survey_Period", {})
                start = period.get("Date_Start")
                end = period.get("Date_End")
                if start and end:
                    try:
                        # Parse and format dates as DD.MM.YYYY
                        start_dt = datetime.strptime(start, "%Y-%m-%d")
                        end_dt = datetime.strptime(end, "%Y-%m-%d")
                        bef_zeitraum = f"{start_dt.strftime('%d.%m.%Y')} - {end_dt.strftime('%d.%m.%Y')}"
                    except Exception:
                        bef_zeitraum = f"{start} - {end}"
                else:
                    # If only one date present or none
                    bef_zeitraum = start or end or ""
                befragte = survey.get("Surveyed_Persons", "")
                # Map party results
                parteiwerte = {}
                for party_id, result in survey.get("Results", {}).items():
                    # Ensure party_id is string for lookup
                    party_info = parties.get(str(party_id), {})
                    party_name = party_info.get("Shortcut") or party_info.get("Name", str(party_id))
                    parteiwerte[party_name] = result  # numeric value (percentage)
                umfragen_list.append({
                    "Institut": inst_name,
                    "Auftraggeber": auftr_name,
                    "Befragungszeitraum": bef_zeitraum,
                    "Erhebungsmethode": method_name,
                    "Befragte": befragte,
                    "Parteiwerte": parteiwerte
                })
            return {"umfragen": umfragen_list}
    except Exception as e:
        # Catch-all for any unexpected errors
        return JSONResponse(
            content={"umfragen": [], "error": f"Fehler beim Abrufen der Umfragen: {str(e)}"},
            status_code=500
        )


NEWS_API_KEY = "2a3e567bac374a1e834d35563af80d59"

@app.get("/news/politik")
async def get_political_news():
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "politik deutschland",
        "language": "de",
        "sortBy": "publishedAt",
        "pageSize": 4,
        "apiKey": NEWS_API_KEY
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            # Extrahiere nur relevante Felder für das Frontend
            articles = [
                {
                    "title": a["title"],
                    "description": a["description"],
                    "date": a["publishedAt"][:10],
                    "image": a["urlToImage"],
                    "url": a["url"]
                }
                for a in data.get("articles", [])
            ]
            return {"articles": articles}

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))