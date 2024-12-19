type WeatherAndDaylight = {
  dt: number; // Unix timestamp
  temp: number; // Temperature in Celsius
  weather: string; // Main weather condition (e.g., "Clear", "Rain")
  daylight: {
    sunrise: string | null; // Sunrise in ISO string format or null
    sunset: string | null; // Sunset in ISO string format or null
  };
};

export const fetchWeatherAndDaylight = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherAndDaylight[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return data.hourly.map((hour: any) => {
      const matchingDay = data.daily.find((daily: any) =>
        hour.dt >= daily.dt && hour.dt < daily.dt + 86400
      );

      return {
        dt: hour.dt, // Timestamp
        temp: hour.temp,
        weather: hour.weather[0]?.main || 'Unknown',
        daylight: matchingDay
          ? {
              sunrise: new Date(matchingDay.sunrise * 1000).toISOString(),
              sunset: new Date(matchingDay.sunset * 1000).toISOString(),
            }
          : { sunrise: null, sunset: null }, // Default if no matching day
      };
    });
  } catch (error) {
    console.error('Error fetching weather and daylight data:', error);
    return [];
  }
};


