import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import { GeoJSON } from "react-leaflet/GeoJSON";
import "leaflet/dist/leaflet.css";
import Select from "react-select";
import L from "leaflet";
import { Feature, FeatureCollection } from "geojson";
import MapZoomToSelection from "./MapZoomToSelection";
import { bundeslandInfos } from "../data/bundeslandInfos";

// Wappen
import wappenBW from "../assets/wappen/baden-wuerrtemberg.svg";
import wappenBY from "../assets/wappen/bayern.svg";
import wappenBE from "../assets/wappen/berlin.svg";
import wappenBB from "../assets/wappen/brandenburg.svg";
import wappenHB from "../assets/wappen/bremen.svg";
import wappenHH from "../assets/wappen/hamburg.svg";
import wappenHE from "../assets/wappen/hessen.svg";
import wappenMV from "../assets/wappen/mecklenburg-vorpommern.svg";
import wappenNI from "../assets/wappen/niedersachsen.svg";
import wappenNW from "../assets/wappen/nordrhein-westfalen.svg";
import wappenRP from "../assets/wappen/rheinland-pfalz.svg";
import wappenSL from "../assets/wappen/saarland.svg";
import wappenSN from "../assets/wappen/sachsen.svg";
import wappenST from "../assets/wappen/sachsen-anhalt.svg";
import wappenSH from "../assets/wappen/schleswig-holstein.svg";
import wappenTH from "../assets/wappen/thueringen.svg";

// Leaflet Icon Fix

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type Bundesland = {
  label: string;
  value: string;
  position: [number, number];
  image?: string;
};

export const bundeslaender: Bundesland[] = [
  { label: "Baden-Württemberg", value: "Baden-Württemberg", position: [48.6616, 9.3501], image: wappenBW },
  { label: "Bayern", value: "Bayern", position: [48.7904, 11.4979], image: wappenBY },
  { label: "Berlin", value: "Berlin", position: [52.5200, 13.4050], image: wappenBE },
  { label: "Brandenburg", value: "Brandenburg", position: [52.4125, 12.5316], image: wappenBB },
  { label: "Bremen", value: "Bremen", position: [53.0793, 8.8017], image: wappenHB },
  { label: "Hamburg", value: "Hamburg", position: [53.5511, 9.9937], image: wappenHH },
  { label: "Hessen", value: "Hessen", position: [50.6521, 9.1624], image: wappenHE },
  { label: "Mecklenburg-Vorpommern", value: "Mecklenburg-Vorpommern", position: [53.6127, 12.4296], image: wappenMV },
  { label: "Niedersachsen", value: "Niedersachsen", position: [52.6367, 9.8451], image: wappenNI },
  { label: "Nordrhein-Westfalen", value: "Nordrhein-Westfalen", position: [51.4332, 7.6616], image: wappenNW },
  { label: "Rheinland-Pfalz", value: "Rheinland-Pfalz", position: [49.9929, 7.8670], image: wappenRP },
  { label: "Saarland", value: "Saarland", position: [49.3964, 7.0220], image: wappenSL },
  { label: "Sachsen", value: "Sachsen", position: [51.1045, 13.2017], image: wappenSN },
  { label: "Sachsen-Anhalt", value: "Sachsen-Anhalt", position: [51.9503, 11.6923], image: wappenST },
  { label: "Schleswig-Holstein", value: "Schleswig-Holstein", position: [54.2194, 9.6961], image: wappenSH },
  { label: "Thüringen", value: "Thüringen", position: [50.9848, 11.0299], image: wappenTH },
];

export const farben: Record<string, string> = {
  CDU: "bg-gray-400",
  SPD: "bg-red-500",
  GRÜNE: "bg-green-500",
  FDP: "bg-yellow-400",
  AfD: "bg-sky-400",
  "Die Linke": "bg-pink-500",
};

const deutschlandBounds: [[number, number], [number, number]] = [[46.0, 5.0], [55.5, 15.5]];
const wahl = ["Bundestagswahl", "Landtagswahl"];
const wahljahr = [2025, 2021, 2017, 2013, 2009, 2005, 2002, 1998, 1994, 1990, 1987, 1984, 1983, 1980, 1976, 1972, 1969, 1965, 1961, 1957, 1953, 1949];

const GeoLayer = ({ geoData, setSelected, selected }: {
  geoData: FeatureCollection;
  setSelected: (b: Bundesland) => void;
  selected: Bundesland | null;
}) => {
  const map = useMap();
  return (
    <GeoJSON
      data={geoData}
      style={(feature) => {
        const isSelected = selected?.value === feature?.properties?.name;
        return {
          fillColor: isSelected ? "#2563eb" : "#4f9cf9",
          weight: 1,
          color: "#fff",
          fillOpacity: 0.6,
        };
      }}
      onEachFeature={(feature: Feature, layer) => {
        const name = feature.properties?.name;
        layer.bindTooltip(`Bundesland: ${name}`, { direction: "center", sticky: true, opacity: 0.8 });
        layer.on("click", () => {
          const bounds = (layer as L.Polygon).getBounds();
          map.flyToBounds(bounds, { padding: [20, 20], animate: true, duration: 1.0 });
          const match = bundeslaender.find((b) => b.value === name);
          if (match) setSelected(match);
        });
      }}
    />
  );
};

const MapPage = () => {
  const [selected, setSelected] = useState<Bundesland | null>(null);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [electionResults, setElectionResults] = useState<Record<string, number> | { error: string } | null>(null);
  const [year, setYear] = useState<number>(2025);

  useEffect(() => {
    fetch("/data/bundeslaender.geo.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`http://localhost:8000/election-results?state=${encodeURIComponent(selected.value)}&year=${year}`)
      .then((res) => res.json())
      .then((data) => setElectionResults(data))
      .catch(() => setElectionResults(null));
  }, [selected, year]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">🗺️ Wahlergebnisse der Bundesländer für die {wahl[0]} {year}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MapContainer
          center={[51.2, 10.5]}
          zoom={3}
          minZoom={6}
          maxZoom={10}
          scrollWheelZoom={true}
          style={{ height: "700px", width: "100%" }}
          maxBounds={deutschlandBounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && <GeoLayer geoData={geoData} setSelected={setSelected} selected={selected} />}
          {selected && <MapZoomToSelection selected={selected} />}
        </MapContainer>

        <div>
          <label className="block mb-1 font-medium">Bundesland:</label>
          <Select
            options={bundeslaender}
            value={selected}
            onChange={(val) => setSelected(val)}
            placeholder="Wählen..."
            formatOptionLabel={(e) => (
              <div className="flex items-center gap-2">
                {e.image && <img src={e.image} alt={e.label} className="w-5 h-5 object-contain" />}
                <span>{e.label}</span>
              </div>
            )}
          />

          <label className="block mb-1 font-medium mt-4">Jahr:</label>
          <Select
            options={wahljahr.map((y) => ({ value: y, label: y.toString() }))}
            value={{ value: year, label: year.toString() }}
            onChange={(val) => setYear(val?.value || 2025)}
          />

          {selected && (
            <div className="mt-6">
              <h2 className="font-semibold text-xl mb-2">Wahlergebnisse – {selected.label}</h2>
              {electionResults && !("error" in electionResults) ? (
                Object.entries(electionResults).map(([partei, prozent]) => (
                  <div key={partei} className="flex items-center mb-2">
                    <div className="w-24">{partei}</div>
                    <div className="flex items-center w-full gap-2">
                      <div
                        className={`h-4 ${farben[partei] || "bg-gray-300"} rounded`}
                        style={{ width: `${prozent}%`, minWidth: "1rem" }}
                      />
                      <span className="text-sm text-black font-medium">
                        {typeof prozent === "number" ? `${prozent.toFixed(1)}%` : "–"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-red-600 italic mt-2">⚠️ Keine Wahldaten verfügbar.</div>
              )}
            </div>
          )}

          {selected && bundeslandInfos[selected.value] && (
            <div className="mt-10 border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">🧾 Informationen zu {selected.label}</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800">
                {Object.entries(bundeslandInfos[selected.value]).map(([kategorie, daten]) => (
                  <div key={kategorie}>
                    <h3 className="font-semibold text-lg mb-2">📌 {kategorie}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(daten).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
