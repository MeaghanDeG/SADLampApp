import { DateTime } from 'luxon';

export const getDaylightData = async (lat, lon, month) => {
  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
  );
  const data = await response.json();

  const days = [];
  const daysInMonth = DateTime.local(2024, month).daysInMonth;

  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(2024, month, i).toISODate();
    days.push({
      date,
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
    });
  }

  return days;
};
