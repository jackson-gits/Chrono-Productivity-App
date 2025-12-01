import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useTaskStore } from '../store/taskStore';
import { useFocusStore } from '../store/focusStore';

export const useSupabaseSync = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncData = async () => {
      try {
        setIsLoading(true);
        console.log('Starting Supabase sync...');

        // Fetch all data from Supabase
        const [tasksResponse, focusResponse, userDataResponse] = await Promise.all([
          api.getTasks(),
          api.getFocusSessions(),
          api.getUserData(),
        ]);

        console.log('Fetched tasks:', tasksResponse.tasks);
        console.log('Fetched focus sessions:', focusResponse.sessions);
        console.log('Fetched user data:', userDataResponse.userData);

        // If Supabase has data, use it to initialize stores
        const taskStore = useTaskStore.getState();
        const focusStore = useFocusStore.getState();

        // Sync tasks if Supabase has data
        if (tasksResponse.tasks && tasksResponse.tasks.length > 0) {
          useTaskStore.setState({
            tasks: tasksResponse.tasks,
          });
        } else {
          // If Supabase is empty, push current localStorage data to Supabase
          console.log('Supabase empty - uploading current tasks');
          await api.saveTasks(taskStore.tasks);
        }

        // Sync focus sessions
        if (focusResponse.sessions && focusResponse.sessions.length > 0) {
          useFocusStore.setState({
            sessions: focusResponse.sessions,
          });
        } else {
          console.log('Supabase empty - uploading current focus sessions');
          await api.saveFocusSessions(focusStore.sessions);
        }

        // Sync user data
        if (userDataResponse.userData) {
          const userData = userDataResponse.userData;
          useTaskStore.setState({
            streak: userData.streak || taskStore.streak,
            totalPoints: userData.totalPoints || taskStore.totalPoints,
            badges: userData.badges || taskStore.badges,
          });
          useFocusStore.setState({
            totalFocusSessions: userData.totalFocusSessions || focusStore.totalFocusSessions,
            totalFocusMinutes: userData.totalFocusMinutes || focusStore.totalFocusMinutes,
          });
        } else {
          // Upload current user data to Supabase
          console.log('Supabase empty - uploading current user data');
          await api.saveUserData({
            streak: taskStore.streak,
            totalPoints: taskStore.totalPoints,
            badges: taskStore.badges,
            totalFocusSessions: focusStore.totalFocusSessions,
            totalFocusMinutes: focusStore.totalFocusMinutes,
          });
        }

        console.log('Supabase sync completed successfully');
        setError(null);
      } catch (err) {
        console.error('Failed to sync with Supabase:', err);
        setError('Failed to sync with Supabase. Using local data.');
      } finally {
        setIsLoading(false);
      }
    };

    syncData();
  }, []);

  return { isLoading, error };
};
