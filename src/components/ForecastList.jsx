import ForecastCard from './ForecastCard.jsx';

function ForecastList({ days, unit }) {
  return (
    <section className="card forecast" aria-labelledby="forecast-title">
      <h2 id="forecast-title" className="section-title">7-day forecast</h2>
      <ul className="forecast__list">
        {days.map((day, index) => (
          <ForecastCard key={day.date} day={day} index={index} unit={unit} />
        ))}
      </ul>
    </section>
  );
}

export default ForecastList;