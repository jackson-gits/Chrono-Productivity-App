import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';

interface FocusSession {
  id: string;
  startTime: string;
  duration: number; // in minutes
  completed: boolean;
}

interface FocusStore {
  sessions: FocusSession[];
  totalFocusSessions: number;
  totalFocusMinutes: number;
  addFocusSession: (duration: number) => void;
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      totalFocusSessions: 12,
      totalFocusMinutes: 300,

      addFocusSession: (duration) =>
        set((state) => {
          const newSession: FocusSession = {
            id: `session-${Date.now()}`,
            startTime: new Date().toISOString(),
            duration,
            completed: true,
          };

          const updatedSessions = [...state.sessions, newSession];
          const newTotalSessions = state.totalFocusSessions + 1;
          const newTotalMinutes = state.totalFocusMinutes + duration;
          
          // Sync to Supabase
          api.saveFocusSessions(updatedSessions).catch(err => console.error('Failed to sync focus sessions:', err));
          api.saveUserData({
            totalFocusSessions: newTotalSessions,
            totalFocusMinutes: newTotalMinutes,
          }).catch(err => console.error('Failed to sync user data:', err));

          return {
            sessions: updatedSessions,
            totalFocusSessions: newTotalSessions,
            totalFocusMinutes: newTotalMinutes,
          };
        }),
    }),
    {
      name: 'chrono-focus-storage',
    }
  )
);