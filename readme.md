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

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]
    
app = FastAPI(debug=True)

origins = [
    "http://localhost:3000",
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"fruits": []}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@app.post("/fruits")
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Run the API

- `python main.py`

## React Setup

### Dependencies 

- NodeJS

### Setup 

- `npm create vite@latest frontend --template react`
- `cd frontend`
- `npm install`
- `npm install axios`

### Components

- Make the following dir structure
  - src/
    - components/
      - Fruits.jsx
      - AddFruitForm.jsx
    - App.jsx
    - main.jsx
    - api.js

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
