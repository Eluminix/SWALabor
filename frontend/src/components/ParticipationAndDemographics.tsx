import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const beteiligungDaten = [
  { jahr: 2009, Beteiligung: 70.8 },
  { jahr: 2013, Beteiligung: 71.5 },
  { jahr: 2017, Beteiligung: 76.2 },
  { jahr: 2021, Beteiligung: 76.6 },
  { jahr: 2025, Beteiligung: 74.1 },
];

const altersgruppenDaten = [
  { name: "18–29 Jahre", value: 14 },
  { name: "30–44 Jahre", value: 21 },
  { name: "45–59 Jahre", value: 28 },
  { name: "60+ Jahre", value: 37 },
];

const geschlechterDaten = [
  { name: "Männer", value: 49 },
  { name: "Frauen", value: 51 },
];

const bildungDaten = [
  { bildung: "Hauptschule", Prozent: 18 },
  { bildung: "Realschule", Prozent: 32 },
  { bildung: "Abitur", Prozent: 28 },
  { bildung: "Hochschule", Prozent: 22 },
];

const berufDaten = [
  { gruppe: "Arbeiter:innen", Anteil: 25 },
  { gruppe: "Angestellte", Anteil: 38 },
  { gruppe: "Selbstständige", Anteil: 10 },
  { gruppe: "Rentner:innen", Anteil: 20 },
  { gruppe: "Schüler:innen/Studierende", Anteil: 7 },
];

const farben = ["#60a5fa", "#818cf8", "#f472b6", "#facc15", "#4ade80", "#fb923c"];

const ParticipationAndDemographicsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      <h1 className="text-3xl font-bold">📈 Wahlbeteiligung & Demografie</h1>

      {/* Beteiligung */}
      <section className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Wahlbeteiligung im Zeitverlauf</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={beteiligungDaten}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis domain={[60, 100]} unit="%" />
            <Tooltip />
            <Bar dataKey="Beteiligung" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Altersverteilung */}
      <section className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Altersverteilung</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={altersgruppenDaten}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {altersgruppenDaten.map((entry, index) => (
                <Cell key={index} fill={farben[index % farben.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Geschlechterverteilung */}
      <section className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Geschlechterverteilung</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={geschlechterDaten}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {geschlechterDaten.map((entry, index) => (
                <Cell key={index} fill={farben[index % farben.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Bildungsstand */}
      <section className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Bildungsstand der Wählerschaft</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bildungDaten}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bildung" />
            <YAxis domain={[0, 40]} unit="%" />
            <Tooltip />
            <Bar dataKey="Prozent" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Berufliche Situation */}
      <section className="border rounded p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Berufliche Situation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={berufDaten}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gruppe" />
            <YAxis domain={[0, 50]} unit="%" />
            <Tooltip />
            <Bar dataKey="Anteil" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ParticipationAndDemographicsPage;
