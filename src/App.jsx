import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import RecentSearches from './components/RecentSearches.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import { fetchWeather } from './api/weatherApi.js';
import './App.css';

const DEFAULT_CITY = 'Beirut';
const MAX_RECENT = 5;
const RECENT_KEY = 'weather:recent';
const UNIT_KEY = 'weather:unit';

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function App() {
  const [recentCities, setRecentCities] = useState(() => readSaved(RECENT_KEY, []));
  const [unit, setUnit] = useState(() => readSaved(UNIT_KEY, 'celsius'));
  const [city, setCity] = useState(() => recentCities[0] ?? DEFAULT_CITY);
  const [searchCount, setSearchCount] = useState(0);
  const [status, setStatus] = useState('loading');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // Fetch the weather whenever a new search (or a retry) happens.
  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        const data = await fetchWeather(city);
        if (ignore) return;
        setWeather(data);
        setStatus('ready');
        const { name } = data.location;
        setRecentCities((previous) =>
          [name, ...previous.filter((item) => item !== name)].slice(0, MAX_RECENT),
        );
      } catch (err) {
        if (ignore) return;
        setError(
          err instanceof TypeError
            ? 'Could not reach the weather service. Check your connection.'
            : err.message,
        );
        setStatus('error');
      }
    }

    loadWeather();

    // Cleanup: if a newer search starts first, ignore this older answer.
    return () => {
      ignore = true;
    };
  }, [city, searchCount]);

  // Save the recent cities and the unit so they survive a page reload.
  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentCities));
  }, [recentCities]);

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, JSON.stringify(unit));
  }, [unit]);

  function showCity(name) {
    setCity(name);
    setStatus('loading');
    setSearchCount((count) => count + 1);
  }

  return (
    <div className="app">
      <Header unit={unit} onUnitChange={setUnit} />

      <main className="app__main">
        <SearchBar onSearch={showCity} isLoading={status === 'loading'} />
        <RecentSearches
          cities={recentCities}
          activeCity={city}
          onSelect={showCity}
          onClear={() => setRecentCities([])}
        />

        {status === 'loading' && <LoadingSpinner message={`Loading weather for ${city}…`} />}
        {status === 'error' && <ErrorMessage message={error} onRetry={() => showCity(city)} />}
        {status === 'ready' && weather && (
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