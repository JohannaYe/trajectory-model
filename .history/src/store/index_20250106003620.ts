import create from 'zustand';

interface AppState {
  currentTouristProfile: string;
  weatherCondition: string;
  timeOfDay: string;
  touristCount: number;
  setTouristProfile: (profile: string) => void;
  setWeatherCondition: (weather: string) => void;
  setTimeOfDay: (time: string) => void;
  setTouristCount: (count: number) => void;
}

export const useStore = create<AppState>((set) => ({
  currentTouristProfile: 'solo',
  weatherCondition: 'sunny',
  timeOfDay: 'morning',
  touristCount: 100,
  setTouristProfile: (profile) => set({ currentTouristProfile: profile }),
  setWeatherCondition: (weather) => set({ weatherCondition: weather }),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setTouristCount: (count) => set({ touristCount: count }),
})); 