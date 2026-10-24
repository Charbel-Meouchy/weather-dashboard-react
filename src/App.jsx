import { useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import { useWeather } from './hooks/useWeather.js';

const DEFAULT_CITY = 'Beirut';

function App() {
  const [city] = useState(DEFAULT_CITY);
  const { weather, error, isLoading, retry } = useWeather(city);
  const unit = 'celsius';

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      {isLoading && <LoadingSpinner message={`Loading weather for ${city}…`} />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {weather && (
        <div className="app__results">
          <WeatherCard location={weather.location} current={weather.current} unit={unit} />
          <ForecastList days={weather.daily} unit={unit} />
        </div>
      )}
    </div>
  );
}

export default App;