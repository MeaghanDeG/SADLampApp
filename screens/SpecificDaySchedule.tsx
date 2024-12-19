import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppStore } from '@/states/appStore';
import { saveUserResponse } from '@/util/database'; // Assuming you have a function for SQLite.

export default function CurrentDayScreen() {
  // Use the app store to access combinedData
  const combinedData = useAppStore((state) => state.combinedData);

  // Get today's date in the correct format
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Find the data for the current day
  const currentDayData = combinedData.find((data) => data.date === today);

  if (!currentDayData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.messageText}>No data available for today.</Text>
      </View>
    );
  }

  // Handle user actions
  const handleKeep = async () => {
    try {
      await saveUserResponse(today, 'kept');
      Alert.alert('Success', 'Your schedule has been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your schedule.');
      console.error(error);
    }
  };

  const handleEdit = () => {
    // Navigate to the editing screen (or update directly here)
    Alert.alert(
      'Edit Schedule',
      'Redirecting to edit screen...',
      [{ text: 'OK' }],
      { cancelable: true }
    );
    // You can integrate a navigation function here if needed.
  };

  const handleDontSave = async () => {
    try {
      await saveUserResponse(today, 'not saved');
      Alert.alert('Info', 'Your schedule was not saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update your response.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.dateText}>Today: {currentDayData.date}</Text>
        <Text style={styles.weatherText}>
          Weather: {currentDayData.weather}, Temp: {currentDayData.temp}°C
        </Text>
        <Text style={styles.daylightText}>
          Sunrise: {currentDayData.daylight.sunrise || 'N/A'}
        </Text>
        <Text style={styles.daylightText}>
          Sunset: {currentDayData.daylight.sunset || 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.scheduleHeader}>Today's Schedules:</Text>
        {currentDayData.schedules.length > 0 ? (
          currentDayData.schedules.map((schedule, index) => (
            <Text key={index} style={styles.scheduleText}>
              {schedule.startTime} - {schedule.endTime}: {schedule.description}
            </Text>
          ))
        ) : (
          <Text style={styles.noSchedulesText}>No schedules for today.</Text>
        )}
      </View>

      {/* Question Section */}
      <View style={styles.card}>
        <Text style={styles.questionText}>
          Were you able to stick to your schedule or do you need to edit for
          your records?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.keepButton} onPress={handleKeep}>
            <Text style={styles.buttonText}>Keep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dontSaveButton} onPress={handleDontSave}>
            <Text style={styles.buttonText}>Don't Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: 'gray',
  },
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
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 16,
    marginBottom: 4,
  },
  daylightText: {
    fontSize: 16,
    marginBottom: 4,
  },
  scheduleHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 8,
  },
  noSchedulesText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  keepButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  dontSaveButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
