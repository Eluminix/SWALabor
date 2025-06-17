import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "leaflet/dist/leaflet.css";

// 🎯 Parteienliste
const parteien = ["CDU", "SPD", "GRÜNE", "FDP", "AfD", "Die Linke"];

const deutschlandBounds: [[number, number], [number, number]] = [[46.0, 5.0], [55.5, 15.5]];

// 🧪 Zeitverlauf-Daten für Diagramm
const dummyDaten: Record<string, { jahr: number; anteil: number }[]> = {
  CDU: [{ jahr: 2005, anteil: 30 }, { jahr: 2009, anteil: 24 }, { jahr: 2013, anteil: 32 }, { jahr: 2017, anteil: 37 }, { jahr: 2021, anteil: 26 }, { jahr: 2025, anteil: 24 }],
  SPD: [{ jahr: 2005, anteil: 28 }, { jahr: 2009, anteil: 23 }, { jahr: 2013, anteil: 25 }, { jahr: 2017, anteil: 20 }, { jahr: 2021, anteil: 26 }, { jahr: 2025, anteil: 28 }],
  GRÜNE: [{ jahr: 2005, anteil: 8 }, { jahr: 2009, anteil: 10 }, { jahr: 2013, anteil: 10 }, { jahr: 2017, anteil: 9 }, { jahr: 2021, anteil: 15 }, { jahr: 2025, anteil: 17 }],
  FDP: [{ jahr: 2005, anteil: 6 }, { jahr: 2009, anteil: 10 }, { jahr: 2013, anteil: 5 }, { jahr: 2017, anteil: 8 }, { jahr: 2021, anteil: 7 }, { jahr: 2025, anteil: 6 }],
  AfD: [{ jahr: 2005, anteil: 0 }, { jahr: 2009, anteil: 0 }, { jahr: 2013, anteil: 5 }, { jahr: 2017, anteil: 12 }, { jahr: 2021, anteil: 11 }, { jahr: 2025, anteil: 13 }],
  "Die Linke": [{ jahr: 2005, anteil: 8 }, { jahr: 2009, anteil: 10 }, { jahr: 2013, anteil: 9 }, { jahr: 2017, anteil: 8 }, { jahr: 2021, anteil: 5 }, { jahr: 2025, anteil: 4 }],
};

// 📊 Stimmenanteil pro Bundesland (2025, Dummy)
const dummyRegional: Record<string, Record<string, number>> = {
  Bayern: { CDU: 33, SPD: 23, GRÜNE: 14, FDP: 7, AfD: 13, "Die Linke": 3 },
  Berlin: { CDU: 20, SPD: 27, GRÜNE: 17, FDP: 5, AfD: 10, "Die Linke": 11 },
  Hessen: { CDU: 34, SPD: 22, GRÜNE: 15, FDP: 6, AfD: 12, "Die Linke": 5 },
  "Nordrhein-Westfalen": { CDU: 36, SPD: 25, GRÜNE: 14, FDP: 4, AfD: 15, "Die Linke": 3 },
  Bremen: { CDU: 26, SPD: 29, GRÜNE: 13, FDP: 6, AfD: 10, "Die Linke": 9 },
  Hamburg: { CDU: 27, SPD: 31, GRÜNE: 18, FDP: 5, AfD: 9, "Die Linke": 7 },
  Niedersachsen: { CDU: 32, SPD: 26, GRÜNE: 16, FDP: 5, AfD: 11, "Die Linke": 4 },
  "Schleswig-Holstein": { CDU: 34, SPD: 24, GRÜNE: 17, FDP: 6, AfD: 8, "Die Linke": 3 },
  "Mecklenburg-Vorpommern": { CDU: 30, SPD: 28, GRÜNE: 11, FDP: 5, AfD: 17, "Die Linke": 6 },
  Brandenburg: { CDU: 29, SPD: 27, GRÜNE: 13, FDP: 5, AfD: 18, "Die Linke": 7 },
  Sachsen: { CDU: 28, SPD: 22, GRÜNE: 12, FDP: 4, AfD: 22, "Die Linke": 6 },
  "Sachsen-Anhalt": { CDU: 27, SPD: 21, GRÜNE: 11, FDP: 5, AfD: 23, "Die Linke": 6 },
  Thüringen: { CDU: 29, SPD: 23, GRÜNE: 12, FDP: 4, AfD: 21, "Die Linke": 8 },
  "Rheinland-Pfalz": { CDU: 33, SPD: 24, GRÜNE: 14, FDP: 5, AfD: 11, "Die Linke": 4 },
  Saarland: { CDU: 32, SPD: 26, GRÜNE: 12, FDP: 5, AfD: 13, "Die Linke": 5 },
  "Baden-Württemberg": { CDU: 35, SPD: 22, GRÜNE: 18, FDP: 6, AfD: 10, "Die Linke": 3 }
};

const getColor = (value: number): string => {
  if (value > 30) return "#1e3a8a"; // dunkelblau
  if (value > 20) return "#3b82f6"; // mittelblau
  if (value > 10) return "#93c5fd"; // hellblau
  if (value > 0) return "#dbeafe"; // sehr hell
  return "#f3f4f6"; // grau
};

const PartyAnalysisPage = () => {
  const [selectedPartei, setSelectedPartei] = useState("CDU");
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/data/bundeslaender.geo.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Partei-Analyse</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Partei:</label>
        <select
          value={selectedPartei}
          onChange={(e) => setSelectedPartei(e.target.value)}
          className="border px-3 py-2 rounded w-60"
        >
          {parteien.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="border rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Stimmenanteil im Zeitverlauf
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dummyDaten[selectedPartei]}>
              <XAxis dataKey="jahr" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="anteil"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Regionale Verteilung (2025)</h2>
          <MapContainer
            center={[51.2, 10.5]}
            zoom={5.1}
            minZoom={5.1}
            maxZoom={10}
            scrollWheelZoom
            style={{ height: "350px", width: "100%" }}
            maxBounds={deutschlandBounds}
            maxBoundsViscosity={1.0}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geoData && (
              <GeoJSON
                data={geoData}
                style={(feature) => {
                    if (!feature || !feature.properties?.name) {
                    return {
                        fillColor: "#f3f4f6",
                        fillOpacity: 0.5,
                        color: "#ccc",
                        weight: 1,
                    };
                    }

                    const name = feature.properties.name;
                    const val = dummyRegional[name]?.[selectedPartei] ?? 0;
                    return {
                    fillColor: getColor(val),
                    fillOpacity: 0.7,
                    color: "#fff",
                    weight: 1,
                    };
                }}
                onEachFeature={(feature, layer) => {
                    const name = feature.properties?.name;
                    const val = dummyRegional[name]?.[selectedPartei] ?? 0;
                    layer.bindTooltip(`${name}: ${val}%`, { sticky: true });
                }}
                />
            )}
          </MapContainer>
        </div>
      </div>

      <div className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Über {selectedPartei}</h2>
        <p className="text-gray-700 leading-relaxed">
          Die Partei {selectedPartei} zeigt regionale Unterschiede bei der Wählergunst. Diese Karte veranschaulicht,
          wie stark sie in den einzelnen Bundesländern bei der Wahl 2025 vertreten ist.
        </p>
      </div>
    </div>
  );
};

export default PartyAnalysisPage;
