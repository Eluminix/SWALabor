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
