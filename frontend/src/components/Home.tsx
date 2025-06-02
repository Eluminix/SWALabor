// src/components/Home.tsx

import React from "react";
import { Link } from "react-router-dom";
import karteImg from "../assets/karte.png";
import vergleichImg from "../assets/vergleich.png";
import vorhersageImg from "../assets/vorhersage.png";
import parteiImg from "../assets/partei.png";
import demografieImg from "../assets/demografie.png";
import zeitverlaufImg from "../assets/zeitverlauf.png";


const Home = () => {
    const features = [
        {
          title: "Interaktive Karte",
          description: "Erkunden Sie die Wahlergebnisse auf einer interaktiven Karte.",
          link: "/karte",
          image: karteImg,
        },
        {
          title: "Vergleichsansicht",
          description: "Vergleichen Sie Ergebnisse zwischen Regionen und Jahren.",
          link: "/vergleich",
          image: vergleichImg,
        },
        {
          title: "Vorhersage-Tool",
          description: "Analysieren Sie mögliche Wahlausgänge.",
          link: "/vorhersage",
          image: vorhersageImg,
        },
        {
          title: "Partei-Analyse",
          description: "Entwicklung und regionale Stärke einer Partei.",
          link: "/partei-analyse",
          image: parteiImg,
        },
        {
          title: "Wahlbeteiligung & Demografie",
          description: "Zusammenhang zwischen Bevölkerung und Beteiligung.",
          link: "/demografie",
          image: demografieImg,
        },
        {
          title: "News",
          description: "Entwicklung der Wahlergebnisse über die Jahre.",
          link: "/news",
          image: zeitverlaufImg,
        },
      ];
      

  return (
    <div className="w-full px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Wahlergebnisse in Deutschland
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Interaktive Visualisierung von Wahlergebnissen aus den deutschen Bundesländern
      </p>
      <div className="flex justify-center gap-4 mb-10">
        <Link to="/karte">
          <button className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 transition">
            Karte anzeigen
          </button>
        </Link>
        <Link to="/mehr-erfahren">
          <button className="border border-gray-400 px-5 py-2 rounded hover:bg-gray-100 transition">
            Mehr erfahren
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            to={feature.link}
            key={feature.title}
            className="bg-white p-6 rounded shadow hover:shadow-md transition border border-gray-100"
          >
             <img
  src={feature.image}
  alt={feature.title}
  className="w-full h-40 object-contain mb-4"
/>

            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
