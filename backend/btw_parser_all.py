import pandas as pd
import re
import os

# Dictionary of Bundesländer (pre-2017 key format)
BL_key_pre17 = {
    901: "Schleswig-Holstein", 902: "Hamburg", 903: "Niedersachsen", 904: "Bremen",
    905: "Nordrhein-Westfalen", 906: "Hessen", 907: "Rheinland-Pfalz", 908: "Baden-Württemberg",
    909: "Bayern", 910: "Saarland", 911: "Berlin", 912: "Brandenburg",
    913: "Mecklenburg-Vorpommern", 914: "Sachsen", 915: "Sachsen-Anhalt",
    916: "Thüringen", 999: "Bundesgebiet"
}

# Input folder with all election CSV files
input_folder = "btw"  # Replace with your actual input folder

# Loop through all CSV files
for file_name in os.listdir(input_folder):
    if not file_name.endswith(".csv"):
        continue

    file_path = os.path.join(input_folder, file_name)

    # Extract year from filename (e.g., "btw2013_kerg.csv" → "2013")
    election_year = re.findall(r"\d+", file_name)[0]
    output_folder = election_year
    os.makedirs(output_folder, exist_ok=True)

    # 1949 election only has one vote
    has_zweitstimmen = election_year != "1949"

    # bundesland codes changed in 2017
    use_modern_structure = int(election_year) >= 2017

    # Load and process CSV
    if use_modern_structure:
        if election_year == "2021":
            df = pd.read_csv(file_path, sep=';', skiprows=2, encoding="utf-8-sig") # 2021 file misses watermark and few rows
        else:
            df = pd.read_csv(file_path, sep=';', skiprows=5, encoding="utf-8-sig")
    else:
        df = pd.read_csv(file_path, sep=';', skiprows=5, encoding="ISO-8859-1")

    header = df.iloc[[0]]
    df.columns = df.columns.str.strip()

    df.iloc[:, 0] = pd.to_numeric(df.iloc[:, 0], errors='coerce')
    df = df.loc[:, df.iloc[1] != 'Vorperiode']

    if use_modern_structure:
        filtered_rows = df[df.iloc[:, 2] == 99]
    else:
        filtered_rows = df[df.iloc[:, 0].isin(BL_key_pre17.keys())]

    bundesland_dfs = []

    for _, row in filtered_rows.iterrows():
        bl_name = row.iloc[1]

        # after 2017 files are encoded in utf-8-bom --> breaks get_loc("Gültige") --> location hard coded
        if election_year == "2017" or election_year == "2021":
            index = 9
        elif election_year == "2025":
            index = 10
        else:
            index = row.index.get_loc('Gültige')

        zweitstimmen_colname = filtered_rows.columns[index + 1]
        bl_erstimmen = pd.to_numeric(row.iloc[index], errors="coerce")
        bl_zweitstimmen = pd.to_numeric(row[zweitstimmen_colname], errors="coerce")

        party_columns = filtered_rows.columns[index + 2:]
        party_list = []
        i = 0

        while i < len(party_columns):
            erst = party_columns[i]

            if has_zweitstimmen:
                if i + 1 >= len(party_columns):
                    break  # Prevent out-of-range access
                zweit = party_columns[i + 1]
            else:
                zweit = None  # No second vote

            party_name = erst if isinstance(erst, str) else zweit
            if isinstance(party_name, str) and re.match(r'^[\w\s\.\-/äöüÄÖÜß]+$', party_name):
                party_list.append((party_name, erst, zweit))

            i += 2 if has_zweitstimmen else 1

        records = []
        for party, erst_col, zweit_col in party_list:
            party_erst = pd.to_numeric(row.get(erst_col), errors="coerce")
            party_zweit = pd.to_numeric(row.get(zweit_col), errors="coerce") if zweit_col else None

            erst_pct = (party_erst / bl_erstimmen * 100) if pd.notna(party_erst) and bl_erstimmen else None
            zweit_pct = (party_zweit / bl_zweitstimmen * 100) if has_zweitstimmen and pd.notna(party_zweit) and bl_zweitstimmen else None

            record = {
                "Party": party,
                "Erststimmen (total)": party_erst,
                "Erststimmen (%)": round(erst_pct, 1) if erst_pct is not None else None
            }

            if has_zweitstimmen:
                record["Zweitstimmen (total)"] = party_zweit
                record["Zweitstimmen (%)"] = round(zweit_pct, 1) if zweit_pct is not None else None

            records.append(record)

        bl_df = pd.DataFrame(records)
        bl_df["Bundesland"] = bl_name
        bundesland_dfs.append(bl_df)

    # Save output CSVs per Bundesland
    for bl_df in bundesland_dfs:
        bundesland = bl_df["Bundesland"].iloc[0].replace(" ", "_")
        filename = f"{bundesland}_{election_year}.csv"
        filepath = os.path.join(output_folder, filename)

        if has_zweitstimmen:
            columns = ["Party", "Erststimmen (total)", "Erststimmen (%)", "Zweitstimmen (total)", "Zweitstimmen (%)"]
        else:
            columns = ["Party", "Erststimmen (total)", "Erststimmen (%)"]

        formatted_df = bl_df[columns].copy()

        formatted_df.to_csv(filepath, sep=';', index=False, encoding="utf-8-sig")
