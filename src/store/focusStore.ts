import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../utils/supabase";

interface FocusSession {
  id: string;
  start_time: string;
  duration_minutes: number;
}

interface FocusStore {
  sessions: FocusSession[];
  totalFocusSessions: number;
  totalFocusMinutes: number;

  loadSessions: () => Promise<void>;
  addFocusSession: (duration: number) => Promise<void>;
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      totalFocusSessions: 0,
      totalFocusMinutes: 0,

      // ---------------------------------------------------
      // LOAD DATA FROM SUPABASE
      // ---------------------------------------------------
      loadSessions: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: sessions, error } = await supabase
          .from("focus_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load focus sessions:", error);
          return;
        }

        const totalMinutes = sessions.reduce(
          (sum, s) => sum + s.duration_minutes,
          0
        );

        set({
          sessions: sessions,
          totalFocusSessions: sessions.length,
          totalFocusMinutes: totalMinutes,
        });
      },

      // ---------------------------------------------------
      // ADD SESSION TO SUPABASE
      // ---------------------------------------------------
      addFocusSession: async (duration) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.error("User not logged in");
          return;
        }

        // Insert new session in DB
        const { data: newSession, error } = await supabase
          .from("focus_sessions")
          .insert({
            user_id: user.id,
            duration_minutes: duration,
            start_time: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("Failed to save focus session:", error);
          return;
        }

        const state = get();

        const updatedSessions = [newSession, ...state.sessions];
        const updatedCount = state.totalFocusSessions + 1;
        const updatedMinutes = state.totalFocusMinutes + duration;

        // Update user stats
        await supabase
          .from("user_stats")
          .upsert(
            {
              user_id: user.id,
              total_points: updatedMinutes, // optional
              streak: updatedCount, // optional
            },
            { onConflict: "user_id" }
          );

        // Update Zustand
        set({
          sessions: updatedSessions,
          totalFocusSessions: updatedCount,
          totalFocusMinutes: updatedMinutes,
        });
      },
    }),
    {
      name: "chrono-focus-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        totalFocusMinutes: state.totalFocusMinutes,
        totalFocusSessions: state.totalFocusSessions,
      }),
    }
  )
);
