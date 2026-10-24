import StatItem from './StatItem.jsx';
import { formatTemperature, formatWindSpeed, getCondition } from '../utils/weather.js';

function WeatherCard({ location, current, unit }) {
  const condition = getCondition(current.weatherCode, current.isDay);

  return (
    <section className="card weather-card" aria-labelledby="current-city">
      <div className="weather-card__main">
        <div>
          <h2 id="current-city" className="weather-card__city">
            {location.name}
            {location.country && <span className="weather-card__country">, {location.country}</span>}
          </h2>
          <p className="weather-card__condition">{condition.label}</p>
          <p className="weather-card__temp">{formatTemperature(current.temperature, unit)}</p>
        </div>
        <span className="weather-card__icon" role="img" aria-label={condition.label}>
          {condition.icon}
        </span>
      </div>

      <dl className="weather-card__stats">
        <StatItem label="Feels like" value={formatTemperature(current.feelsLike, unit)} />
        <StatItem label="Humidity" value={`${current.humidity}%`} />
        <StatItem label="Wind" value={formatWindSpeed(current.windSpeed, unit)} />
      </dl>
    </section>
  );
}

export default WeatherCard;