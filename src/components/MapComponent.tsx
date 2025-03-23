import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface CityWeather {
  name: string;
  temperature: number;
  description: string;
}

const MapComponent: React.FC = () => {
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([49.0069, 8.4037]);  // Karlsruhe


  // Funktion zum Abrufen der Wetterdaten
  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: 'fa18b6ac78f43e6768652082480f9218', // Verwende deinen eigenen OpenWeatherMap API Key
          units: 'metric', // Um die Temperatur in Celsius zu erhalten
        },
      });

      const data = response.data;
      setWeather({
        name: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // useMapEvents Hook zum Handling von Klicks auf der Karte
  const MapClickEvent = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        setCoordinates([lat, lon]);

        // Wetterdaten basierend auf den Koordinaten abrufen
        getWeatherData(lat, lon);
      },
    });

    return null; // Dieser Komponent rendert nichts, sondern kümmert sich nur um das Event
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer center={coordinates} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickEvent /> {/* Hier verwenden wir den Event-Handler */}
        <Marker position={coordinates}>
          <Popup>
            <div>
              <h2>Weather in {weather?.name}</h2>
              {weather ? (
                <>
                  <p>Temperature: {weather.temperature}°C</p>
                  <p>Condition: {weather.description}</p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
