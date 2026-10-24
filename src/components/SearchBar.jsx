import { useState } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [hint, setHint] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const city = query.trim();

    if (!city) {
      setHint('Please type a city name first.');
      return;
    }

    setHint('');
    onSearch(city);
    setQuery('');
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="city-input" className="visually-hidden">
        City name
      </label>
      <input
        id="city-input"
        className="search__input"
        type="text"
        placeholder="Search a city, e.g. Beirut"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (hint) setHint('');
        }}
        autoComplete="off"
      />
      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? 'Searching…' : 'Search'}
      </button>
      {hint && <p className="search__hint">{hint}</p>}
    </form>
  );
}

export default SearchBar;