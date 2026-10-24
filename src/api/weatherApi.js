const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  return response.json();
}

async function findCity(name, signal) {
  const params = new URLSearchParams({ name, count: '1', language: 'en', format: 'json' });
  const data = await getJson(`${GEOCODING_URL}?${params}`, signal);

  if (!data.results || data.results.length === 0) {
    throw new Error(`No city found for "${name}". Check the spelling and try again.`);
  }

  const { name: cityName, country, latitude, longitude } = data.results[0];
  return { name: cityName, country, latitude, longitude };
}

async function getForecast({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });
  return getJson(`${FORECAST_URL}?${params}`, signal);
}

export async function fetchWeather(cityName, signal) {
  const location = await findCity(cityName, signal);
  const forecast = await getForecast(location, signal);

  return {
    location,
    current: {
      temperature: forecast.current.temperature_2m,
      feelsLike: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: forecast.current.wind_speed_10m,
      weatherCode: forecast.current.weather_code,
      isDay: forecast.current.is_day === 1,
    },
    daily: forecast.daily.time.map((date, index) => ({
      date,
      weatherCode: forecast.daily.weather_code[index],
      max: forecast.daily.temperature_2m_max[index],
      min: forecast.daily.temperature_2m_min[index],
      rainChance: forecast.daily.precipitation_probability_max[index],
    })),
  };
}