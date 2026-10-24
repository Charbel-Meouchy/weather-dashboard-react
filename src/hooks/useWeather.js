import { useEffect, useEffectEvent, useState } from 'react';
import { fetchWeather } from '../api/weatherApi.js';

/**
 * Fetches weather for a city whenever the city (or a retry) changes.
 * Loading is derived: if the latest result belongs to a different request,
 * a new one is in flight, so no extra state has to be kept in sync.
 */
export function useWeather(city, onSuccess) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // Lets the effect call the latest onSuccess without re-fetching when it changes.
  const notifySuccess = useEffectEvent((data) => onSuccess?.(data));

  useEffect(() => {
    if (!city) return undefined;

    const controller = new AbortController();
    const key = `${city}#${attempt}`;

    fetchWeather(city, controller.signal)
      .then((data) => {
        setResult({ key, data, error: null });
        notifySuccess(data);
      })
      .catch((error) => {
        // A newer search cancelled this request; ignore it.
        if (error.name === 'AbortError') return;
        const message =
          error instanceof TypeError
            ? 'Could not reach the weather service. Check your connection.'
            : error.message;
        setResult({ key, data: null, error: message });
      });

    return () => controller.abort();
  }, [city, attempt]);

  const isCurrent = result?.key === `${city}#${attempt}`;

  return {
    weather: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    isLoading: Boolean(city) && !isCurrent,
    retry: () => setAttempt((count) => count + 1),
  };
}