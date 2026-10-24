function RecentSearches({ cities, activeCity, onSelect, onClear }) {
  if (cities.length === 0) return null;

  return (
    <nav className="recent" aria-label="Recent searches">
      <span className="recent__label">Recent:</span>
      <ul className="recent__list">
        {cities.map((city) => (
          <li key={city}>
            <button
              type="button"
              className={`chip${city.toLowerCase() === activeCity.toLowerCase() ? ' is-active' : ''}`}
              onClick={() => onSelect(city)}
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="recent__clear" onClick={onClear}>
        Clear
      </button>
    </nav>
  );
}

export default RecentSearches;