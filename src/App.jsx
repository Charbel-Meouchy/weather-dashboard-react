import { useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import RecentSearches from './components/RecentSearches.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import { useWeather } from './hooks/useWeather.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import './App.css';

const DEFAULT_CITY = 'Beirut';
const MAX_RECENT = 5;

function App() {
  const [recentCities, setRecentCities] = useLocalStorage('weather:recent', []);
  const [unit, setUnit] = useLocalStorage('weather:unit', 'celsius');
  const [city, setCity] = useState(() => recentCities[0] ?? DEFAULT_CITY);

  // Only cities that actually returned weather are saved, using the API's spelling.
  function addRecentCity(data) {
    const { name } = data.location;
    setRecentCities((previous) =>
      [name, ...previous.filter((item) => item !== name)].slice(0, MAX_RECENT),
    );
  }

  const { weather, error, isLoading, retry } = useWeather(city, addRecentCity);

  return (
    <div className="app">
      <Header unit={unit} onUnitChange={setUnit} />

      <main className="app__main">
        <SearchBar onSearch={setCity} isLoading={isLoading} />
        <RecentSearches
          cities={recentCities}
          activeCity={city}
          onSelect={setCity}
          onClear={() => setRecentCities([])}
        />

        {isLoading && <LoadingSpinner message={`Loading weather for ${city}…`} />}
        {error && <ErrorMessage message={error} onRetry={retry} />}
        {weather && (
          <div className="app__results">
            <WeatherCard location={weather.location} current={weather.current} unit={unit} />
            <ForecastList days={weather.daily} unit={unit} />
          </div>
        )}
      </main>

      <footer className="footer">
        Weather data from{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}

export default App;