import { fetchWeatherAndDaylight } from '@/util/fetchWeatherAndDaylight';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

type AppState = {
  userLocation: { latitude: number; longitude: number } | null;
  schedule: {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    description: string;
  }[];
  combinedData: CombinedData[];
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
  addScheduleItem: (item: { id: string; day: string; startTime: string; endTime: string; description: string }) => void;
  removeScheduleItem: (id: string) => void;
  getSchedulesForDay: (day: string) => CombinedData['schedules'];
  updateCombinedData: () => Promise<void>;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userLocation: null,
      schedule: [],
      combinedData: [],

      setUserLocation: (location) => set({ userLocation: location }),

      addScheduleItem: (item) =>
        set((state) => ({
          schedule: [...state.schedule, item],
        })),

      removeScheduleItem: (id) =>
        set((state) => ({
          schedule: state.schedule.filter((item) => item.id !== id),
        })),

      getSchedulesForDay: (day) =>
        get().schedule.filter((item) => item.day.toLowerCase() === day.toLowerCase()),

      updateCombinedData: async () => {
        const location = get().userLocation;
        if (!location) {
          console.error('User location is not set.');
          return;
        }

        const apiKey = 'b9e24e87ee0051d4a02686595d4f5fe3';
        const weatherDaylightData = await fetchWeatherAndDaylight(
          location.latitude,
          location.longitude,
          apiKey
        );

        const newCombinedData = weatherDaylightData.map((hour) => {
          const dateKey = new Date(hour.dt * 1000).toISOString().split('T')[0]; // YYYY-MM-DD
          const daySchedules = get().getSchedulesForDay(dateKey);

          return {
            date: new Date(hour.dt * 1000).toLocaleDateString(),
            schedules: daySchedules,
            daylight: hour.daylight,
            weather: hour.weather,
            temp: hour.temp,
          };
        });

        set({ combinedData: newCombinedData });
      },
    }),
    {
      name: 'app-store',
    }
  )
);

