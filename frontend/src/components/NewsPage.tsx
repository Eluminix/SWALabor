import React, { useEffect, useState } from "react";

// 🔧 Interface für News-Einträge definieren
interface NewsItem {
  url: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Beispiel: Lokale JSON-Datei oder API-Endpunkt ersetzen
    fetch("http://localhost:8000/news/politik") // <-- Passe diesen Pfad ggf. an
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Unbekannter Fehler");
        }

        try {
          return res.json();
        } catch {
          throw new Error("Antwort ist kein gültiges JSON");
        }
      })
      .then((data) => {
        setNews(data.articles);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der News:", err);
        setError("Konnte News nicht laden.");
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📰 Aktuelle Nachrichten</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-6">
        {news.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition duration-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <p className="text-gray-700 mb-2">{item.description}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg max-h-60 w-full object-cover"
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
