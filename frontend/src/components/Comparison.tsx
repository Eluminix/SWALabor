import React, { useEffect, useState } from "react";
import Select from "react-select";
import { bundeslandInfos } from "../data/bundeslandInfos";
import { Bundesland } from "./Map"; // falls in Map.tsx exportiert
import { farben } from "./Map";  // falls Farben ausgelagert wurden
import { bundeslaender } from "./Map";


const parteien = ["CDU", "SPD", "GRÜNE", "FDP", "AfD", "Die Linke"];

const Vergleich = () => {
  const [selectedStates, setSelectedStates] = useState<Bundesland[]>([]);
  const [results, setResults] = useState<Record<string, Record<string, number> | null>>({});

  useEffect(() => {
    selectedStates.forEach((state) => {
      if (results[state.value]) return;

      fetch(`http://localhost:8000/election-results?state=${encodeURIComponent(state.value)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults((prev) => ({ ...prev, [state.value]: data }));
        })
        .catch(() => {
          setResults((prev) => ({ ...prev, [state.value]: null }));
        });
    });
  }, [selectedStates]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🔍 Vergleich der Wahlergebnisse</h1>

      <Select
        isMulti
        options={bundeslaender}
        value={selectedStates}
        onChange={(val) => setSelectedStates(val as Bundesland[])}
        placeholder="Bundesländer auswählen..."
        className="mb-6"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="p-2 text-left">Partei</th>
              {selectedStates.map((state) => (
                <th key={state.value} className="p-2 text-left">{state.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parteien.map((partei) => (
              <tr key={partei} className="border-t">
                <td className="p-2 font-semibold">{partei}</td>
                {selectedStates.map((state) => {
                  const result = results[state.value];
                  const value = result?.[partei];

                  return (
                    <td key={state.value} className="p-2">
                      {typeof value === "number" ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 ${farben[partei] || "bg-gray-300"} rounded`}
                            style={{ width: `${value}%`, minWidth: "1rem" }}
                          />
                          <span className="text-sm text-black font-medium">
                            {value.toFixed(1)}%
                          </span>
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
    </div>
  );
};

export default Vergleich;
