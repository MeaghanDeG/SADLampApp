export const rateWeather = (weather: string): number => {
    const weatherRatings: { [key: string]: number } = {
      Clear: 10,
      Clouds: 7,
      Rain: 4,
      Snow: 3,
      Thunderstorm: 2,
    };
  
    return weatherRatings[weather] || 1; // Default to 1 for unknown weather.
  };
  