// WMO weather codes used by Open-Meteo, grouped into readable conditions.
const CONDITIONS = [
  { codes: [0], label: 'Clear sky', icon: '☀️', nightIcon: '🌙' },
  { codes: [1, 2], label: 'Partly cloudy', icon: '⛅', nightIcon: '☁️' },
  { codes: [3], label: 'Overcast', icon: '☁️' },
  { codes: [45, 48], label: 'Fog', icon: '🌫️' },
  { codes: [51, 53, 55, 56, 57], label: 'Drizzle', icon: '🌦️' },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: 'Rain', icon: '🌧️' },
  { codes: [71, 73, 75, 77, 85, 86], label: 'Snow', icon: '❄️' },
  { codes: [95, 96, 99], label: 'Thunderstorm', icon: '⛈️' },
];

const UNKNOWN = { label: 'Unknown', icon: '🌡️' };

export function getCondition(code, isDay = true) {
  const match = CONDITIONS.find((condition) => condition.codes.includes(code)) ?? UNKNOWN;
  const icon = !isDay && match.nightIcon ? match.nightIcon : match.icon;
  return { label: match.label, icon };
}

export function formatTemperature(celsius, unit) {
  const value = unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatWindSpeed(kmh, unit) {
  return unit === 'fahrenheit' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`;
}

export function formatDayName(isoDate, index) {
  if (index === 0) return 'Today';
  // Noon avoids the date shifting a day in time zones behind UTC.
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
}