# FastAPI + React

## FastAPI Setup

### Dependencies

- Python 3.9+

### Setup

- `mkdir backend`
- `cd backend`
- Create a virtual environment: `python3 -m venv venv`
- Activate the virtual environment:
  - Mac/Linux: `source ./venv/bin/activate`
  - Windows: `.\venv\Scripts\activate`
- Install the dependencies from [requirements.txt](./backend/requirements.txt)
  - `pip install -r requirements.txt`

### Basic FastAPI Without Auth

```python
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Datenmodell für das Wetter
class Weather(BaseModel):
    city: str
    temperature: float
    description: str
    humidity: int
    wind_speed: float

class WeatherResponse(BaseModel):
    weather: Weather

app = FastAPI(debug=True)

# CORS Middleware Konfiguration
origins = [
    "http://localhost:5173",  # Frontend-URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Erlaubte Origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Beispielhafte Datenbank (In-Memory)
memory_db = {"weather": []}

# Beispielroute, die das Wetter für eine Stadt zurückgibt
@app.get("/weather/{city}", response_model=WeatherResponse)
def get_weather(city: str):
    # Hier solltest du eine API wie OpenWeatherMap, WeatherStack oder ähnliches einbinden,
    # um das echte Wetter abzurufen. Aktuell geben wir nur Beispielwerte zurück.
    # Du kannst die `memory_db["weather"]` durch echte Daten ersetzen, wenn du API-Abfragen machst.
    
    # Beispielhafte Antwort
    example_weather = Weather(
        city=city,
        temperature=22.5,
        description="Clear Sky",
        humidity=55,
        wind_speed=5.0
    )
    memory_db["weather"].append(example_weather)
    
    return WeatherResponse(weather=example_weather)

# Beispielroute, um manuell Wetterdaten hinzuzufügen
@app.post("/weather")
def add_weather(weather: Weather):
    memory_db["weather"].append(weather)
    return weather

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

### Run the API

- `python main.py`

## React Setup

### Dependencies 

- NodeJS

### Setup 

- `cd .. (In Hauptverzeichnis wechseln)`
- `mkdir frontend`
- `cd frontend`
- Create a virtual environment: `python3 -m venv venv`
- Activate the virtual environment:
  - Mac/Linux: `source ./venv/bin/activate`
  - Windows: `.\venv\Scripts\activate`
- `npm create vite@latest --template react`
- `npm install`
- `npm install axios`

### Components

- Make the following dir structure
  - src/
    - components/
      - WeatherForm.tsx
      - WeatherDisplay.tsx
    - App.tsx
    - main.tsx
    - api.ts

### WeatherDisplay.tsx

```tsx
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
```

### WeatherForm.tsx

```tsx
import React, { useState } from 'react';

interface WeatherFormProps {
  onSubmit: (city: string) => void;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onSubmit }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSubmit(city);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button type="submit">Get Weather</button>
    </form>
  );
};

export default WeatherForm;
```

### App.tsx

```tsx
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
```

### api.ts

```ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // Deine FastAPI-Backend-URL

export const getWeather = async (city: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${city}`);
    return response.data.weather;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
```

### Run the App

- `npm run dev`
