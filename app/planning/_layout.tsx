import React from 'react';
import { Stack } from 'expo-router';

export default function PlanningLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Planning Overview' }} />
      <Stack.Screen name="details" options={{ title: 'Planning Details' }} />
    </Stack>
  );
}
