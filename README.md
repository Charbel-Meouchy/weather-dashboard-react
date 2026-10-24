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
│   └── weatherApi.js        # fetch calls to Open-Meteo, turns the response into app data
├── hooks/
│   ├── useWeather.js        # useEffect data fetching with abort + derived loading state
│   └── useLocalStorage.js   # useState that persists to localStorage
├── utils/
│   └── weather.js           # weather code → label/icon, unit + date formatting
├── components/
│   ├── Header.jsx           # title + UnitToggle
│   ├── UnitToggle.jsx       # °C / °F switch
│   ├── SearchBar.jsx        # controlled input, owns its own query state
│   ├── RecentSearches.jsx   # clickable chips of past cities
│   ├── LoadingSpinner.jsx   # loading state
│   ├── ErrorMessage.jsx     # error state with optional retry
│   ├── WeatherCard.jsx      # current conditions
│   ├── StatItem.jsx         # reusable label/value tile
│   ├── ForecastList.jsx     # 7-day forecast grid
│   └── ForecastCard.jsx     # one forecast day
├── App.jsx                  # owns shared state and composes the page
├── App.css                  # component styles
├── index.css                # design tokens (colors, spacing) and base styles
└── main.jsx                 # React entry point
```

## How state and data flow

**Where state lives.** State is kept in the lowest component that needs it:

| State          | Lives in        | Why |
| -------------- | --------------- | --- |
| `query` (input text) and `hint` | `SearchBar` | Only the search bar needs the text while typing; the parent only hears about it on submit through `onSearch`. |
| `city`         | `App`           | Shared by the fetch hook, `RecentSearches` (active chip) and the loading message. |
| `unit`         | `App` (persisted) | Shared by `Header` → `UnitToggle` and by both weather displays. |
| `recentCities` | `App` (persisted) | Written when a fetch succeeds, read by `RecentSearches`. |
| `result`, `attempt` | `useWeather` | Fetch result and a retry counter, kept out of the UI components. |

`isLoading` is **derived** instead of stored: if the stored result belongs to a different request than the current `city`, a request is in flight. This avoids keeping a separate loading flag in sync.

**Data fetching (`useWeather`).** The `useEffect` depends on `[city, attempt]`, so it runs again only when the user searches a new city or presses **Try again**. Each run creates an `AbortController` and the cleanup function aborts it, so a slow old request can never overwrite a newer one (and React StrictMode's double-run in development is handled). `useEffectEvent` lets the effect call the latest `onSuccess` callback without adding it to the dependency array, which would otherwise refetch on every render.

**Persistence (`useLocalStorage`).** A second `useEffect` writes the value whenever `[key, value]` changes. The initial value is read once with a lazy `useState` initializer.

**Props and prop drilling.** Data flows down as props and changes flow up through callbacks (`onSearch`, `onSelect`, `onUnitChange`, `onRetry`). No state is passed more than two levels deep: `unit` goes `App → Header → UnitToggle` and `App → ForecastList → ForecastCard`. That is shallow enough that Context would add complexity without a real benefit, so plain props were kept.

## Tech

- React 19 (functional components and hooks only)
- Vite
- Plain CSS with custom properties, Flexbox and Grid (mobile-first)
- Open-Meteo Geocoding + Forecast APIs