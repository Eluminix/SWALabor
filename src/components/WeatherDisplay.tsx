import React from 'react';

interface Weather {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
}

interface WeatherDisplayProps {
  weather: Weather | null;
  error: string | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, error }) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weather) {
    return <div>No weather data available.</div>;
  }

  return (
    <div>
      <h2>Weather in {weather.city}</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Description: {weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.wind_speed} m/s</p>
    </div>
  );
};

export default WeatherDisplay;
