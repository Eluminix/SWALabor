// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MapPage from "./components/Map";
import ComparisonPage from "./components/Comparison";

// Dummy-Komponenten als Platzhalter
//const Karte = () => <div>Interaktive Karte</div>;
// const Vergleich = () => <div>Vergleichsansicht</div>;
const Vorhersage = () => <div>Vorhersage-Tool</div>;
const ParteiAnalyse = () => <div>Partei-Analyse</div>;
const Demografie = () => <div>Wahlbeteiligung & Demografie</div>;
const News = () => <div>News</div>;
const MehrErfahren = () => <div>Mehr erfahren</div>;

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-12 py-10">
      <Routes>  
      <Route path="/" element={<Home />} />
      <Route path="/karte" element={<MapPage />} />
      <Route path="/vergleich" element={<ComparisonPage />} />
      <Route path="/vorhersage" element={<Vorhersage />} />
      <Route path="/partei-analyse" element={<ParteiAnalyse />} />
      <Route path="/demografie" element={<Demografie />} />
      <Route path="/news" element={<News />} />
      <Route path="/mehr-erfahren" element={<MehrErfahren />} />
    </Routes>
    </main>
    </div>
  );
}

export default App;
