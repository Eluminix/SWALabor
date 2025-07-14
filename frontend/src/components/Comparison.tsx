import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Bundesland, bundeslaender } from "./Map";
import { farben } from "./Map";

const parteien = ["CDU", "SPD", "GRÜNE", "FDP", "AfD", "Die Linke"];
const jahre = [2021, 2025];

const Vergleich = () => {
  const [selectedStates, setSelectedStates] = useState<Bundesland[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [results, setResults] = useState<Record<string, Record<string, number> | null>>({});

  useEffect(() => {
    selectedStates.forEach((state) => {
      const key = `${state.value}_${selectedYear}`;
      if (results[key]) return;

      fetch(`http://localhost:8000/election-results?state=${encodeURIComponent(state.value)}&year=${selectedYear}`)
        .then((res) => res.json())
        .then((data) => {
          setResults((prev) => ({ ...prev, [key]: data }));
        })
        .catch(() => {
          setResults((prev) => ({ ...prev, [key]: null }));
        });
    });
  }, [selectedStates, selectedYear]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🔍 Vergleich der Wahlergebnisse</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="w-full md:w-1/2">
          <label className="block mb-1 font-medium">Bundesländer (max. 2):</label>
          <Select
            isMulti
            options={bundeslaender}
            value={selectedStates}
            onChange={(val) => {
              if (Array.isArray(val) && val.length <= 2) {
                setSelectedStates(val);
              }
            }}
            placeholder="Bundesländer auswählen..."
          />
        </div>

        <div className="w-full md:w-1/4">
          <label className="block mb-1 font-medium">Wahljahr:</label>
          <Select
            options={jahre.map((y) => ({ label: `${y}`, value: y }))}
            value={{ label: `${selectedYear}`, value: selectedYear }}
            onChange={(val) => setSelectedYear(val?.value || 2025)}
            placeholder="Jahr wählen"
          />
        </div>
      </div>

      {selectedStates.length === 0 ? (
        <p className="text-gray-600 italic">Bitte Bundesländer auswählen.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Partei</th>
                {selectedStates.map((state) => (
                  <th key={state.value} className="p-2 text-left">{state.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parteien.map((partei) => (
                <tr key={partei} className="border-t">
                  <td className="p-2 font-medium">{partei}</td>
                  {selectedStates.map((state) => {
                    const key = `${state.value}_${selectedYear}`;
                    const result = results[key];
                    const value = result?.[partei];

                    return (
                      <td key={key} className="p-2">
                        {typeof value === "number" ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 ${farben[partei] || "bg-gray-300"} rounded`}
                              style={{ width: `${value}%`, minWidth: "1rem" }}
                            />
                            <span className="text-sm text-black font-medium">{value.toFixed(1)}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Keine Daten</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vergleich;
