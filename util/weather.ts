export const fetchWeatherData = async (lat: number, lon: number, apiKey: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      );
      const data = await response.json();
  
      return data.list.map(entry => ({
        dt_txt: entry.dt_txt, // Date and time
        weather: entry.weather, // Weather condition
        main: entry.main, // Temp, pressure, etc.
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return [];
    }
  };
  