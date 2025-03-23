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
