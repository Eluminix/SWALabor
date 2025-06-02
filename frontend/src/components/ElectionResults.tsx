import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

// Typen für die Daten definieren
type ElectionRow = Record<string, string>;
type ChartData = {
  name: string;
  SPD: number;
  CDU: number;
  Gruene: number;
  FDP: number;
  AfD: number;
};

type ElectionResultsProps = {
  csvFile: string;
};

const ElectionResults: React.FC<ElectionResultsProps> = ({ csvFile }) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(csvFile);
      const reader = await response.text();

      // PapaParse mit richtigem Delimiter ";"
      const results = Papa.parse<ElectionRow>(reader, {
        header: true, // Header-Zeile wird erkannt
        skipEmptyLines: true, // Leere Zeilen ignorieren
        delimiter: ";", // Wichtiger Delimiter für deutsche CSVs
      });

      console.log("Rohdaten aus CSV:", results.data); // Debugging

      // Wir suchen die richtigen Spaltennamen (weil CSV manchmal mehrere hat)
      const findColumn = (obj: ElectionRow, keyword: string) => {
        return Object.keys(obj).find((key) => key.includes(keyword)) || "";
      };

      const formattedData: ChartData[] = results.data
        .filter((row) => row["Gebiet"] && row["Gebiet"].trim() !== "") // Nur echte Gebiete, keine Leerzeilen
        .map((row) => ({
          name: row["Gebiet"]?.trim() || "Unbekannt",
          SPD: parseInt(row[findColumn(row, "Sozialdemokratische Partei Deutschlands Erststimmen")]?.replace(/\D/g, "") || "0"),
          CDU: parseInt(row[findColumn(row, "Christlich Demokratische Union Deutschlands Erststimmen")]?.replace(/\D/g, "") || "0"),
          Gruene: parseInt(row[findColumn(row, "BÜNDNIS 90/DIE GRÜNEN Erststimmen")]?.replace(/\D/g, "") || "0"),
          FDP: parseInt(row[findColumn(row, "Freie Demokratische Partei Erststimmen")]?.replace(/\D/g, "") || "0"),
          AfD: parseInt(row[findColumn(row, "Alternative für Deutschland Erststimmen")]?.replace(/\D/g, "") || "0"),
        }));

      console.log("Verarbeitete Daten:", formattedData); // Debugging

      setData(formattedData);
    };

    fetchData();
  }, [csvFile]);

  return (
    <div>
      <h2>Wahlergebnisse Bundestagswahl 2025</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="SPD" fill="#FF0000" />
          <Bar dataKey="CDU" fill="#000000" />
          <Bar dataKey="Gruene" fill="#00FF00" />
          <Bar dataKey="FDP" fill="#FFD700" />
          <Bar dataKey="AfD" fill="#0000FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectionResults;
