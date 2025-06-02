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
