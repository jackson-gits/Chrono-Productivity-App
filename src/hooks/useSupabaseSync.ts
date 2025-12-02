import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useFocusStore } from "../store/focusStore";
import { supabase } from "../utils/supabase";

export const useSupabaseSync = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const taskStore = useTaskStore();
  const focusStore = useFocusStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Check active session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log("No user logged in. Skipping Supabase sync.");
          setIsLoading(false);
          return;
        }

        // Load tasks from db
        await taskStore.loadTasks();

        // Load focus sessions
        await focusStore.loadSessions();

        setError(null);
      } catch (err) {
        console.error("Supabase sync error:", err);
        setError("Failed to load from Supabase.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { isLoading, error };
};
