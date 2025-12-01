import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c9339a2a`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`API Error on ${endpoint}:`, error);
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  // Tasks
  getTasks: () => apiCall('/tasks'),
  saveTasks: (tasks: any[]) => apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify({ tasks }),
  }),
  deleteTask: (taskId: string) => apiCall(`/tasks/${taskId}`, {
    method: 'DELETE',
  }),

  // Focus Sessions
  getFocusSessions: () => apiCall('/focus-sessions'),
  saveFocusSessions: (sessions: any[]) => apiCall('/focus-sessions', {
    method: 'POST',
    body: JSON.stringify({ sessions }),
  }),

  // User Data
  getUserData: () => apiCall('/user-data'),
  saveUserData: (userData: any) => apiCall('/user-data', {
    method: 'POST',
    body: JSON.stringify({ userData }),
  }),
};
