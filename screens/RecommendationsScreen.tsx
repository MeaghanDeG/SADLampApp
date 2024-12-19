import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { fetchWeatherAndDaylight } from '../util/fetchWeatherAndDaylight';
import { calculateOptimalTime } from '../utils/calculateOptimalTime';
import { getCurrentLocation } from '../util/location';

const RecommendationsScreen = () => {
  const { data: combinedData, isLoading, error } = useQuery(
    'weatherAndDaylight',
    async () => {
      // Dynamically fetch the user's location
      const { latitude, longitude } = await getCurrentLocation();

      // Fetch weather and daylight data using the user's location
      return fetchWeatherAndDaylight(latitude, longitude, 'YOUR_API_KEY');
    },
    {
      retry: 2, // Retry fetching up to 2 times in case of failure
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    }
  );

  if (isLoading) {
    return <Text style={styles.loading}>Loading recommendations...</Text>;
  }

  if (error || !combinedData) {
    return <Text style={styles.loading}>Failed to load data. Please try again.</Text>;
  }

  const optimalTime = calculateOptimalTime(combinedData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      <Text style={styles.recommendation}>{optimalTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  recommendation: { fontSize: 16, textAlign: 'center', color: 'green' },
  loading: { textAlign: 'center', marginTop: 20 },
});

export default RecommendationsScreen;
