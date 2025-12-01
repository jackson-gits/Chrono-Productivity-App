import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Database, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';

export function DataViewer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasks, sessions, userData] = await Promise.all([
        api.getTasks(),
        api.getFocusSessions(),
        api.getUserData(),
      ]);
      
      setData({
        tasks: tasks.tasks,
        focusSessions: sessions.sessions,
        userData: userData.userData,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Supabase Data Viewer
        </CardTitle>
        <CardDescription>
          View what's currently stored in your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={fetchData} disabled={loading} className="w-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Fetch Data from Supabase'}
        </Button>

        {data && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-700 mb-2">Tasks ({data.tasks?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(data.tasks, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Focus Sessions ({data.focusSessions?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(data.focusSessions, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">User Data</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(data.userData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
