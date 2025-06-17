import React, { useEffect, useState } from "react";
import Select from "react-select";
import { bundeslaender, Bundesland } from "./Map"; // falls dort definiert
import { farben } from "./Map";

type ParteiProzent = Record<string, number>;
type HistorischeDaten = Record<string, ParteiProzent>;

const jahre = [2026, 2027, 2028, 2029, 2030].map((y) => ({
  label: y.toString(),
  value: y,
}));

const PredictionPage = () => {
  const [selectedState, setSelectedState] = useState<Bundesland | null>(null);
  const [targetYear, setTargetYear] = useState<{ label: string; value: number } | null>(jahre[0]);
  const [historicalData, setHistoricalData] = useState<HistorischeDaten | null>(null);
  const [forecast, setForecast] = useState<ParteiProzent | null>(null);

  useEffect(() => {
    if (!selectedState) return;
    fetch(`http://localhost:8000/historical-results?state=${encodeURIComponent(selectedState.value)}`)
      .then((res) => res.json())
      .then((data) => setHistoricalData(data))
      .catch(() => setHistoricalData(null));
  }, [selectedState]);

  useEffect(() => {
    if (!historicalData || !targetYear) return;

    const parteien = Object.keys(Object.values(historicalData)[0] || {});
    const forecast: ParteiProzent = {};

    parteien.forEach((partei) => {
      const years = Object.keys(historicalData)
        .map(Number)
        .sort((a, b) => a - b);
      const values = years.map((year) => historicalData[year]?.[partei] ?? 0);

      // lineare Regression (y = a*x + b)
      const n = years.length;
      const sumX = years.reduce((a, b) => a + b, 0);
      const sumY = values.reduce((a, b) => a + b, 0);
      const sumXY = years.reduce((acc, x, i) => acc + x * values[i], 0);
      const sumX2 = years.reduce((acc, x) => acc + x * x, 0);

      const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const b = (sumY - a * sumX) / n;

      const prognoseWert = a * targetYear.value + b;
      forecast[partei] = Math.max(0, Math.min(100, parseFloat(prognoseWert.toFixed(1))));
    });

    setForecast(forecast);
  }, [historicalData, targetYear]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🔮 Wahlprognose (Beta)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-1 font-medium">Bundesland</label>
          <Select
            options={bundeslaender}
            value={selectedState}
            onChange={(val) => setSelectedState(val)}
            placeholder="Bundesland wählen"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Zieljahr</label>
          <Select
            options={jahre}
            value={targetYear}
            onChange={(val) => setTargetYear(val)}
            placeholder="Jahr wählen"
          />
        </div>
      </div>

      {forecast ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Prognose für {selectedState?.label} im Jahr {targetYear?.label}
          </h2>

          {Object.entries(forecast).map(([partei, prozent]) => (
            <div key={partei} className="flex items-center mb-2">
              <div className="w-24">{partei}</div>
              <div className="flex items-center gap-2 w-full">
                <div
                  className={`h-4 ${farben[partei] || "bg-gray-300"} rounded`}
                  style={{ width: `${prozent}%`, minWidth: "1rem" }}
                />
                <span className="text-sm font-medium">{prozent.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        selectedState && (
          <p className="text-gray-500 italic mt-4">Keine Prognosedaten verfügbar.</p>
        )
      )}
    </div>
  );
};

export default PredictionPage;
