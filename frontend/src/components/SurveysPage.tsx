import React, { useEffect, useState } from "react";

interface Partei {
  [key: string]: string | number;
}

interface Umfrage {
  Institut: string;
  Auftraggeber: string;
  Befragungszeitraum: string;
  Erhebungsmethode: string;
  Befragte: string;
  Parteiwerte: Partei;
}

const SurveysPage: React.FC = () => {
  const [umfragen, setUmfragen] = useState<Umfrage[]>([]);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const controller = new AbortController();

  fetch("http://localhost:8000/umfragen/neu?wahl=Bundestagswahl", {
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Unbekannter Fehler");
      }
      return res.json();
    })
    .then((data) => {
      setUmfragen(data.umfragen);
      setError(null); // Fehler zurücksetzen bei Erfolg
    })
    .catch((err) => {
      if (err.name === "AbortError") {
        console.warn("Request wurde abgebrochen (React Strict Mode)");
        return; // kein echter Fehler
      }

      console.error("Fehler beim Laden der Umfragen:", err);
      setError("Konnte Umfragen nicht laden.");
    });

  return () => controller.abort();
}, []);


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Aktuelle Umfragen zur Bundestagswahl</h1>

      {error && <div className="text-red-500">{error}</div>}

      {umfragen.map((umfrage, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-2xl p-4 mb-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{umfrage.Institut}</h2>
            <span className="text-sm text-gray-500">
              {umfrage.Befragungszeitraum}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Auftraggeber: {umfrage.Auftraggeber} • Methode:{" "}
            {umfrage.Erhebungsmethode} • Befragte: {umfrage.Befragte}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(umfrage.Parteiwerte).map(([party, value]) => (
              <div
                key={party}
                className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-center"
              >
                <div className="font-medium">{party}</div>
                <div className="text-blue-600 font-bold">{value}%</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveysPage;
