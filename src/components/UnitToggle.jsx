const UNITS = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {UNITS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`unit-toggle__button${unit === option.value ? ' is-active' : ''}`}
          aria-pressed={unit === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default UnitToggle;