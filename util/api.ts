import axios from 'axios';
import { DateTime } from 'luxon';

// Fetch sunrise and sunset times for a specific latitude and longitude
export const fetchDaylightData = async (lat: number, lon: number) => {
  const response = await axios.get('https://api.sunrise-sunset.org/json', {
    params: { lat, lng: lon, formatted: 0 },
  });
  return response.data.results;
};
const processDaylightData = () => {
  const daylightData = calculateData();
  return daylightData; // Ensure this line ends with a semicolon
}; // Properly close the function

const API_KEY = 'b9e24e87ee0051d4a02686595d4f5fe3'; // Store securely, this is just an example!

/**
 * Fetch current weather data for a city and country.
 * @param {string} city - The city name (e.g., "London").
 * @param {string} country - The country code (e.g., "uk").
 * @returns {Promise<object>} - The weather data object.
 */
export const fetchCurrentWeather = async (city: string, country: string) => {
  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: `${city},${country}`,
          APPID: API_KEY,
          units: 'metric', // Use 'imperial' for Fahrenheit if needed
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch 5-day weather forecast and daylight data for a location.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @param {string} apiKey - The OpenWeather API key.
 * @returns {Promise<object>} - The weather and daylight data object.
 */
export const fetchWeatherData = async (
  lat: number,
  lon: number,
  apiKey: string,
) => {
  const response = await axios.get(
    'https://api.openweathermap.org/data/2.5/forecast',
    {
      params: { lat, lon, appid: apiKey, units: 'metric' },
    },
  );
  return response.data;
};

// Utility to group forecast data by day
const groupForecastByDay = (forecast: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  forecast.forEach(entry => {
    const date = DateTime.fromSeconds(entry.dt).toISODate(); // Group entries by date
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });

  // Map grouped data into an array of objects
  return Object.keys(grouped).map(date => ({
    date,
    entries: grouped[date],
  }));
};

// Example utility: Check if a schedule overlaps with daylight hours
export const checkScheduleOverlap = (
  scheduleStart: string,
  scheduleEnd: string,
  sunrise: string,
  sunset: string,
) => {
  const start = DateTime.fromFormat(scheduleStart, 'HH:mm');
  const end = DateTime.fromFormat(scheduleEnd, 'HH:mm');
  const daylightStart = DateTime.fromISO(sunrise);
  const daylightEnd = DateTime.fromISO(sunset);

  // Check for overlap
  return start < daylightEnd && end > daylightStart;
};
