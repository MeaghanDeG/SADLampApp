import * as Location from 'expo-location';

/**
 * Fetch the user's current location.
 * Ensures permissions are requested before accessing the location.
 * @returns {Promise<{ latitude: number; longitude: number }>} The user's location.
 * @throws Will throw an error if location permissions are denied or unavailable.
 */
export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
  // Request foreground location permissions
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission not granted.');
  }

  // Fetch the user's current location
  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

