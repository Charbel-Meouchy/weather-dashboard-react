import UnitToggle from './UnitToggle.jsx';

function Header({ unit, onUnitChange }) {
  return (
    <header className="header">
      <div>
        <h1 className="header__title">
          <span aria-hidden="true">🌤️</span> Weather Dashboard
        </h1>
        <p className="header__subtitle">Current conditions and a 7-day forecast for any city</p>
      </div>
      <UnitToggle unit={unit} onChange={onUnitChange} />
    </header>
  );
}

export default Header;