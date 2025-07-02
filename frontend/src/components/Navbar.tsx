import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Home } from "lucide-react"; // Nur wenn du Lucide nutzt

const navItems = [
  { name: "Interaktive Karte", path: "/karte" },
  { name: "Vergleich", path: "/vergleich" },
  { name: "Vorhersage", path: "/vorhersage" },
  { name: "Partei-Analyse", path: "/partei-analyse" },
  { name: "Wahlbeteiligung & Demografie", path: "/demografie" },
  { name: "Wahlumfragen", path: "/umfragen" },
  { name: "News", path: "/news" },
];

const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        
        {/* 🔗 Home Button + Logo/Text */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-1 hover:text-blue-700 transition">
            {/* Option A: Lucide Icon */}
            
            {/* Option B: Emoji-Fallback => <span className="text-lg">🏠</span> */}
            <span className="text-xl font-bold text-blue-700">🏠 Wahlergebnisse</span>
          </Link>
        </div>

        {/* 🔗 Navigation rechts */}
        <div className="flex flex-wrap gap-4 mt-2 md:mt-0 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `hover:text-blue-700 transition ${
                  isActive ? "text-blue-700 font-semibold underline" : "text-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
