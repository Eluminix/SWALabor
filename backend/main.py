import csv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔍 Hilfsfunktion zum Parsen einer Wahl-CSV
WICHTIGE_PARTEIEN = {"CDU", "SPD", "GRÜNE", "FDP", "AfD", "Die Linke"}

def parse_election_csv(file_path: str) -> Dict[str, float]:
    result = {}
    with open(file_path, encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=";")
        for row in reader:
            if len(row) > 5 and row[0].strip() in WICHTIGE_PARTEIEN and row[4]:
                try:
                    party = row[0].strip()
                    value = row[4].replace("+", "").replace(",", ".")
                    result[party] = round(float(value), 1)
                except ValueError:
                    continue
    return result

# 📡 API-Endpunkt zum Abrufen von Wahlergebnissen
@app.get("/election-results")
def get_results(state: str = Query(..., alias="state")):
    filename = state.lower().replace(" ", "_").replace("-", "_")
    path = f"data/wahl_{filename}_2025.csv"
    
    if not os.path.exists(path):
        return {"error": "Keine Daten für dieses Bundesland verfügbar."}

    results = parse_election_csv(path)
    return results if results else {"error": "Keine gültigen Wahldaten gefunden."}

# Frontend ausliefern
#app.mount("/", StaticFiles(directory="dist", html=True), name="static")
