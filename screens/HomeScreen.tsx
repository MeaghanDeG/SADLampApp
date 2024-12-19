import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../states/appStore'; // Zustand store
import { fetchWeatherAndDaylight } from '../util/fetchWeatherAndDaylight';
import { rateWeather } from '../util/rateWeather';
import { DateTime } from 'luxon';
import { getCurrentLocation } from '../util/location';

type Daylight = {
  sunrise: string | null;
  sunset: string | null;
  duration: string;
};

type WeatherSummary = {
  time: string;
  weather: string;
  score: number;
};

type ForecastDay = {
  date: string;
  daylight: Daylight;
  schedule: {
    id: string;
    startTime: string;
    endTime: string;
    description: string;
  }[];
  weatherSummary: WeatherSummary;
};

const HomeScreen = () => {
  const { schedule } = useAppStore(); // Fetch schedule from Zustand store
  const [forecast, setForecast] = useState<ForecastDay[]>([]); // Forecast data state
  const [error, setError] = useState<string | null>(null); // Error state for location/weather
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's current location
        const { latitude, longitude } = await getCurrentLocation();

        // Fetch weather and daylight data
        const data = await fetchWeatherAndDaylight(
          latitude,
          longitude,
          'b9e24e87ee0051d4a02686595d4f5fe3' // Replace with your OpenWeather API key
        );

        // Process forecast data
        const processedForecast = data.map((day: any) => {
          const daylightStart = day.daylight?.sunrise
            ? DateTime.fromISO(day.daylight.sunrise)
            : null;
          const daylightEnd = day.daylight?.sunset
            ? DateTime.fromISO(day.daylight.sunset)
            : null;

          const daylightDuration = daylightStart && daylightEnd
            ? daylightEnd.diff(daylightStart, 'hours').hours.toFixed(2)
            : 'N/A';

          return {
            date: day.dt_txt,
            daylight: {
              sunrise: daylightStart
                ? daylightStart.toLocaleString(DateTime.TIME_SIMPLE)
                : 'N/A',
              sunset: daylightEnd
                ? daylightEnd.toLocaleString(DateTime.TIME_SIMPLE)
                : 'N/A',
              duration: daylightDuration,
            },
            schedule: schedule.filter(
              (item) =>
                item.day.toLowerCase() ===
              DateTime.fromISO(day.dt_txt).toLocaleString({ weekday: 'long' }).toLowerCase()

            ),
            weatherSummary: {
              time: DateTime.fromISO(day.dt_txt).toLocaleString(
                DateTime.TIME_SIMPLE
              ),
              weather: day.weather[0].main,
              score: rateWeather(day.weather[0].main),
            },
          };
        });

        setForecast(processedForecast);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load location or weather data.');
      } finally {
        setIsLoading(false); // Stop loading state
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {forecast.length > 0 ? (
        forecast.map((day) => (
          <View key={day.date} style={styles.dayContainer}>
            <Text style={styles.dayHeader}>
              {DateTime.fromISO(day.date).toLocaleString(DateTime.DATE_HUGE)}
            </Text>
            <Text style={styles.subHeader}>Daylight:</Text>
            <Text style={styles.daylightText}>
              Sunrise: {day.daylight.sunrise}, Sunset: {day.daylight.sunset},
              Duration: {day.daylight.duration} hours
            </Text>
            <Text style={styles.subHeader}>Weather Forecast:</Text>
            <Text style={styles.weatherText}>
              {day.weatherSummary.time}: {day.weatherSummary.weather} (Score:{' '}
              {day.weatherSummary.score})
            </Text>
            <Text style={styles.subHeader}>Your Schedule:</Text>
            {day.schedule.length > 0 ? (
              day.schedule.map((item) => (
                <Text key={item.id} style={styles.scheduleText}>
                  {item.startTime} - {item.endTime}: {item.description}
                </Text>
              ))
            ) : (
              <Text style={styles.noSchedule}>No schedule for this day.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No forecast data available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  daylightText: {
    fontSize: 14,
    marginVertical: 2,
  },
  weatherText: {
    fontSize: 14,
    marginVertical: 2,
  },
  scheduleText: {
    fontSize: 14,
    marginVertical: 2,
  },
  noSchedule: {
    fontSize: 14,
    color: 'gray',
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 32,
  },
});

export default HomeScreen;
