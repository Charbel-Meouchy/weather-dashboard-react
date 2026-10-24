# Weather Dashboard (React)

My Weather Dashboard rebuilt as a React application with Vite. Search any city to see the current conditions and a 7-day forecast, switch between °C and °F, and jump back to recent searches.

Weather data comes from [Open-Meteo](https://open-meteo.com/), which is free and needs **no API key**, so the app runs as soon as the dependencies are installed.

## Getting started

Requirements: [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (includes npm).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

Other scripts:

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run build`   | Builds the production bundle to `dist/` |
| `npm run preview` | Serves the production build locally  |
| `npm run lint`    | Lints the code with ESLint           |

## Features

- Search any city by name (empty input is rejected with a hint)
- Current temperature, condition, feels-like, humidity and wind
- 7-day forecast with highs, lows and chance of rain
- °C / °F toggle (wind switches between km/h and mph)
- Recent searches (only cities that were found) saved in `localStorage`
- Loading, error (with **Try again**) and success states
- Responsive layout from phones to desktops, light and dark mode

## Project structure

```
src/
├── api/
│   └── weatherApi.js        # fetch calls to Open-Meteo (async/await, checks response.ok)
├── utils/
│   └── weather.js           # weather code → label/icon, unit + date formatting
├── components/
│   ├── Header.jsx           # title + UnitToggle
│   ├── UnitToggle.jsx       # °C / °F switch
│   ├── SearchBar.jsx        # controlled input, owns its own query state
│   ├── RecentSearches.jsx   # clickable chips of past cities
│   ├── LoadingSpinner.jsx   # loading state
│   ├── ErrorMessage.jsx     # error state with a Try again button
│   ├── WeatherCard.jsx      # current conditions
│   ├── StatItem.jsx         # reusable label/value tile
│   ├── ForecastList.jsx     # 7-day forecast grid
│   └── ForecastCard.jsx     # one forecast day
├── App.jsx                  # owns shared state, fetches data, composes the page
├── App.css                  # component styles
├── index.css                # design tokens (colors, spacing) and base styles
└── main.jsx                 # React entry point
```

## How state and data flow

**Where state lives.** Each piece of state lives in the closest component that needs it:

| State | Lives in | Why |
| ----- | -------- | --- |
| `query`, `hint` | `SearchBar` | Only the search bar needs the text while typing. The parent hears about it on submit through `onSearch`. |
| `city`, `searchCount` | `App` | The city to show, and a counter that changes on every search or retry so the same city can be fetched again. |
| `status`, `weather`, `error` | `App` | The result of the fetch. `status` (`loading` / `ready` / `error`) decides which screen is shown. |
| `unit` | `App` | Needed by `Header → UnitToggle` and by both weather displays. Saved in `localStorage`. |
| `recentCities` | `App` | Updated when a fetch succeeds, read by `RecentSearches`. Saved in `localStorage`. |

**Data fetching.** The fetch runs in a `useEffect` in `App` with the dependency array `[city, searchCount]`, so it runs on the first render and again only when the user searches, picks a recent city, or presses **Try again**. Inside the effect an `async` function uses `await` with `try` / `catch`; `weatherApi.js` throws when `response.ok` is false or when the city is not found, so every failure ends in the same `catch` and shows a friendly message. The effect's cleanup function sets an `ignore` flag, so if a new search starts before an old request finishes, the old answer is thrown away.

**Saving to localStorage.** Two more effects save `recentCities` and `unit` whenever they change (`[recentCities]`, `[unit]`). They are read back once when the app starts.

**Props and prop drilling.** Data flows down as props and actions flow up through callbacks (`onSearch`, `onSelect`, `onUnitChange`, `onRetry`). No state goes more than two levels deep: `unit` goes `App → Header → UnitToggle` and `App → ForecastList → ForecastCard`. Two levels is fine, so plain props were kept instead of Context.

## Tech

- React 19 (functional components with `useState` and `useEffect` only)
- Vite
- Plain CSS with custom properties, Flexbox and Grid (mobile-first)
- Open-Meteo Geocoding + Forecast APIs