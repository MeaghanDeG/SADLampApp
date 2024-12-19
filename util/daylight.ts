import { DateTime } from 'luxon';

/**
 * Fetch daylight data (sunrise and sunset) for a given location and date range.
 * @param lat - Latitude of the location.
 * @param lon - Longitude of the location.
 * @param month - The month for which to fetch data (1 = January, 12 = December).
 * @returns Array of objects containing date, sunrise, and sunset times.
 */
export const fetchDaylightData = async (
  lat: number,
  lon: number,
  month: number
): Promise<{ date: string; sunrise: string; sunset: string }[]> => {
  const daysInMonth = DateTime.local(2024, month).daysInMonth;

  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
  );
  const data = await response.json();

  if (!data.results) {
    throw new Error('Failed to fetch daylight data.');
  }

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(2024, month, i).toISODate();

    // Add fake data to simulate correct results (you'll replace with API logic)
    days.push({
      date,
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
    });
  }

  return days;
};

/**
 * Process daylight data to calculate the duration of daylight for each day.
 * @param daylightData - Array of daylight data with sunrise and sunset times.
 * @returns Array of objects with date and daylight duration in hours.
 */
export const calculateDaylightDuration = (
  daylightData: { date: string; sunrise: string; sunset: string }[]
): { date: string; duration: number }[] => {
  return daylightData.map(day => {
    const sunrise = DateTime.fromISO(day.sunrise);
    const sunset = DateTime.fromISO(day.sunset);
    const duration = sunset.diff(sunrise, 'hours').hours;

    return {
      date: day.date,
      duration: parseFloat(duration.toFixed(2)), // Duration in hours
    };
  });
};
