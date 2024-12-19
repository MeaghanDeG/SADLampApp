import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FiveDayScreen from '@/screens/FiveDayScreen'; // Adjust based on your folder setup
import SadLampQuestions from '@/screens/SadLampQuestions';

const TabConfig = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home',
  },
  {
    name: 'planning',
    title: 'Planning',
    icon: 'calendar',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'cog',
  },
  {
    name: 'FiveDayScreen',
    title: 'FiveDayScreen',
    icon: 'clock-o',
  },
  {
    name: 'sadLampQuestions',
    title: 'Questions',
    icon: 'question-circle',
  },
];

function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <FontAwesome
      size={24}
      style={{ marginBottom: -2 }}
      name={name}
      color={color}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#303030' : '#e0e0e0', // Fallback colors
        },
        headerShown: false,
      }}
    >
      {TabConfig.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name={
                  tab.icon as React.ComponentProps<typeof FontAwesome>['name']
                }
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
