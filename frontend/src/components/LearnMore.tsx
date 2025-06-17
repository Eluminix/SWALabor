import React from "react";

const MehrErfahren = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8">Mehr erfahren</h1>

      <p className="text-center text-gray-700 mb-10">
        Diese Webanwendung bietet eine moderne, interaktive Visualisierung von Wahlergebnissen in Deutschland. Sie richtet sich an Bürger:innen, Forschende, Medien und Bildungseinrichtungen, die sich für politische Entwicklungen auf Landes- und Bundesebene interessieren.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Einführung</h2>
        <p className="text-gray-700">
          Die Plattform stellt verschiedene Werkzeuge bereit: eine interaktive Karte zur Erkundung der Wahlergebnisse auf Landesebene, ein Vergleichsmodul zwischen Bundesländern und ein Prognosetool auf Basis vergangener Trends. Ergänzend werden demografische und sozioökonomische Informationen bereitgestellt, um die Ergebnisse besser einordnen zu können.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Funktionen</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Interaktive Karte:</strong> Visualisierung der Zweitstimmenverteilungen pro Bundesland und Jahr</li>
          <li><strong>Wahlvergleich:</strong> Vergleich von Wahlergebnissen zwischen bis zu zwei Bundesländern – auch jahrgangsübergreifend</li>
          <li><strong>Demografische Analyse:</strong> Kombination von Wahlergebnissen mit Bevölkerungsstruktur, Altersdurchschnitt, Arbeitslosenquote u.a.</li>
          <li><strong>Prognose (Beta):</strong> Einfache Schätzung möglicher Wahlausgänge auf Basis linearer Trendmodelle</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Zielgruppen</h2>
        <p className="text-gray-700">
          Die Anwendung richtet sich an alle, die sich für politische Entwicklungen interessieren – insbesondere:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Politisch interessierte Bürger:innen</li>
          <li>Studierende und Forschende der Politikwissenschaft</li>
          <li>Lehrkräfte und Bildungseinrichtungen</li>
          <li>Journalist:innen und Redaktionen</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Technischer Hintergrund</h2>
        <p className="text-gray-700">
          Die Anwendung basiert auf einem modernen Technologie-Stack:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li><strong>Frontend:</strong> React + TypeScript + Vite + Tailwind CSS</li>
          <li><strong>Backend:</strong> FastAPI (Python) zur API-Bereitstellung</li>
          <li><strong>Visualisierung:</strong> Leaflet-Karten, Balkendiagramme</li>
          <li><strong>Deployment:</strong> Docker für konsistentes Hosting und lokale Entwicklung</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Datenschutz & Transparenz</h2>
        <p className="text-gray-700">
          Der Schutz persönlicher Daten hat höchste Priorität. Es werden ausschließlich aggregierte, öffentlich verfügbare Daten verwendet. Die verwendeten Datenquellen sowie der Zeitpunkt der letzten Aktualisierung werden transparent dokumentiert.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Zukünftige Erweiterungen</h2>
        <p className="text-gray-700">
          Geplant sind u.a.:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Darstellung auf Wahlkreisebene</li>
          <li>Integration weiterer Parteien und Listen</li>
          <li>Erweiterte Zeitvergleiche (mehrere Jahre auf einmal)</li>
          <li>Mobile-optimierte Visualisierungen</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Kontakt</h2>
        <p className="text-gray-700">
          Bei Fragen, Feedback oder Interesse an Kooperation wenden Sie sich bitte an das Projektteam unter:
          <br />
          <a href="mailto:wahlergebnisse@example.com" className="text-blue-600 underline">wahlergebnisse@example.com</a>
        </p>
      </section>
    </div>
  );
};

export default MehrErfahren;
