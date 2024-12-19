import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppStore } from '@/states/appStore';
import { fetchWeatherAndDaylight } from '@/util/fetchWeatherAndDaylight';
import { getCurrentLocation } from '@/util/location';
import Constants from 'expo-constants';

type WeatherAndDaylight = {
  dt: number;
  temp: number;
  weather: string;
  daylight: {
    sunrise: string | null;
    sunset: string | null;
  };
};

type CombinedData = {
  date: string;
  schedules: {
    description: string;
    startTime: string;
    endTime: string;
  }[];
  daylight: {
    sunrise: string | null;
    sunset: string | null;
  };
  weather: string;
  temp: number;
};

export default function FiveDayScreen() {
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { userLocation, getSchedulesForDay } = useAppStore();

  const fetchCombinedData = async () => {
    try {
      let location = userLocation;

      if (!location) {
        location = await getCurrentLocation();
      }

      const apiKey = Constants.manifest.extra.OPENWEATHERMAP_API_KEY;

      const weatherDaylightData: WeatherAndDaylight[] = await fetchWeatherAndDaylight(
        location.latitude,
        location.longitude,
        apiKey
      );

      const combined = weatherDaylightData.map((hour) => {
        const daySchedules = getSchedulesForDay(
          new Date(hour.dt * 1000).toISOString().split('T')[0]
        );

        return {
          date: new Date(hour.dt * 1000).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          schedules: daySchedules,
          daylight: hour.daylight,
          weather: hour.weather,
          temp: hour.temp,
        };
      });

      setCombinedData(combined);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch weather or location data. Please try again.',
        [{ text: 'Retry', onPress: fetchCombinedData }]
      );
      console.error('Error fetching combined data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, [userLocation, getSchedulesForDay]);

  const renderItem = useCallback(
    ({ item }: { item: CombinedData }) => (
      <View style={styles.card}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.daylightText}>
          Daylight: {item.daylight?.sunrise || 'N/A'} - {item.daylight?.sunset || 'N/A'}
        </Text>
        <Text style={styles.weatherText}>
          Weather: {item.weather}, Temp: {item.temp}°C
        </Text>
        <Text style={styles.scheduleHeader}>Schedules:</Text>
        {item.schedules.length > 0 ? (
          item.schedules.map((schedule, index) => (
            <Text key={index} style={styles.scheduleText}>
              {schedule.startTime} - {schedule.endTime}: {schedule.description}
            </Text>
          ))
        ) : (
          <Text style={styles.noSchedulesText}>No schedules for this day.</Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: CombinedData) => item.date, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={combinedData}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await fetchCombinedData();
        setRefreshing(false);
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  daylightText: { fontSize: 16, marginBottom: 4 },
  weatherText: { fontSize: 16, marginBottom: 8 },
  scheduleHeader: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  scheduleText: { fontSize: 14, marginLeft: 8 },
  noSchedulesText: { fontSize: 14, fontStyle: 'italic', color: 'gray' },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 8 },
});
