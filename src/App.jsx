import { useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { useWeather } from './hooks/useWeather.js';

const DEFAULT_CITY = 'Beirut';

function App() {
  const [city] = useState(DEFAULT_CITY);
  const { weather, error, isLoading, retry } = useWeather(city);

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      {isLoading && <LoadingSpinner message={`Loading weather for ${city}…`} />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {weather && (
        <p>
          {weather.location.name}: {Math.round(weather.current.temperature)}°C
        </p>
      )}
    </div>
  );
}

export default App;