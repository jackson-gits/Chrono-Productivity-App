import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    (set) => ({
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

          return {
            sessions: [...state.sessions, newSession],
            totalFocusSessions: state.totalFocusSessions + 1,
            totalFocusMinutes: state.totalFocusMinutes + duration,
          };
        }),
    }),
    {
      name: 'chrono-focus-storage',
    }
  )
);
