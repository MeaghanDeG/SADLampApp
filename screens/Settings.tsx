import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';
import { useAppStore } from '../states/appStore';
import * as Location from 'expo-location';

export default function SettingsScreen() {
  const { userLocation, setUserLocation } = useAppStore(); // Zustand store for location
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Toggle push notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    Alert.alert(
      'Notifications',
      notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled'
    );
  };

  // Update user location
  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert('Location Updated Successfully');
    } catch (error) {
      Alert.alert('Error Fetching Location', error.message);
    }
  };

  // Reset app data
  const resetData = () => {
    Alert.alert('Reset Data', 'Are you sure you want to clear all app data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          // Clear schedules and responses (example)
          console.log('Clearing app data...'); // Replace with your data-clearing logic
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Location */}
      <Text style={styles.settingLabel}>Location</Text>
      <Text style={styles.settingValue}>
        Latitude: {userLocation?.latitude || 'Unknown'}, Longitude: {userLocation?.longitude || 'Unknown'}
      </Text>
      <Button title="Update Location" onPress={updateLocation} />

      {/* Notifications */}
      <View style={styles.toggleContainer}>
        <Text style={styles.settingLabel}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      {/* Reset Data */}
      <Button title="Reset App Data" onPress={resetData} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  settingValue: {
    fontSize: 14,
    marginBottom: 16,
    color: 'gray',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
});
