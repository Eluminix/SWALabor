import React, { useState } from 'react';
import { getWeather } from './api';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import MapComponent from './components/MapComponent';
import './App.css'

const App: React.FC = () => {
  const [weather, setWeather] = useState<null | { city: string; temperature: number; description: string; humidity: number; wind_speed: number }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCitySubmit = async (city: string) => {
    setError(null);  // Fehler zurücksetzen
    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
    } catch (error) {
      setError('Failed to fetch weather data.');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <MapComponent />
        <WeatherForm onSubmit={handleCitySubmit} />
        <WeatherDisplay weather={weather} error={error} /> 
      </main>
    </div>
  );
};

export default App;
