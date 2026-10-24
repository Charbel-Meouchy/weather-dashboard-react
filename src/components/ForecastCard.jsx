import { formatDayName, formatTemperature, getCondition } from '../utils/weather.js';

function ForecastCard({ day, index, unit }) {
  const condition = getCondition(day.weatherCode);

  return (
    <li className="forecast-card">
      <p className="forecast-card__day">{formatDayName(day.date, index)}</p>
      <span className="forecast-card__icon" role="img" aria-label={condition.label}>
        {condition.icon}
      </span>
      <p className="forecast-card__temps">
        <span className="forecast-card__max">{formatTemperature(day.max, unit)}</span>
        <span className="forecast-card__min">{formatTemperature(day.min, unit)}</span>
      </p>
      {day.rainChance !== null && <p className="forecast-card__rain">💧 {day.rainChance}%</p>}
    </li>
  );
}

export default ForecastCard;