import { useState, useEffect } from 'react';
import { Bell, Clock, Moon, Smartphone, Volume2, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { supabase } from "../utils/supabase";
import { DataViewer } from './DataViewer';
import React from 'react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    taskDeadlines: true,
    focusSessionEnd: true,
    weeklyReport: false,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    studyDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
    autoStartBreak: false,
  });
  useEffect(() => {
    const root = document.documentElement;   
  
    if (preferences.theme === "dark") {
      root.classList.add("dark");
    } else if (preferences.theme === "light") {
      root.classList.remove("dark");
    } else {
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", system);
    }
  }, [preferences.theme]);
  
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Settings</h2>
        <p className="text-gray-600">Customize your Chrono experience</p>
      </div>

      {/* Data Viewer */}
      <DataViewer />

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Bell className="w-5 h-5" />
            Notifications & Reminders
          </CardTitle>
          <CardDescription>
            Manage when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="daily-reminders">Daily Study Reminders</Label>
              <p className="text-sm text-gray-500">Get reminded about your daily tasks</p>
            </div>
            <Switch
              id="daily-reminders"
              checked={notifications.dailyReminders}
              onCheckedChange={() => handleNotificationToggle('dailyReminders')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="task-deadlines">Task Deadline Alerts</Label>
              <p className="text-sm text-gray-500">Alerts for upcoming deadlines</p>
            </div>
            <Switch
              id="task-deadlines"
              checked={notifications.taskDeadlines}
              onCheckedChange={() => handleNotificationToggle('taskDeadlines')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="focus-end">Focus Session Completion</Label>
              <p className="text-sm text-gray-500">Notify when focus timer ends</p>
            </div>
            <Switch
              id="focus-end"
              checked={notifications.focusSessionEnd}
              onCheckedChange={() => handleNotificationToggle('focusSessionEnd')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="weekly-report">Weekly Progress Report</Label>
              <p className="text-sm text-gray-500">Summary of your weekly achievements</p>
            </div>
            <Switch
              id="weekly-report"
              checked={notifications.weeklyReport}
              onCheckedChange={() => handleNotificationToggle('weeklyReport')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Focus Timer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="w-5 h-5" />
            Focus Timer Preferences
          </CardTitle>
          <CardDescription>
            Customize your Pomodoro timer settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Study Duration (minutes)</Label>
              <span className="text-sm text-gray-600">{preferences.studyDuration} min</span>
            </div>
            <Slider
              value={[preferences.studyDuration]}
              onValueChange={(value) => handlePreferenceChange('studyDuration', value[0])}
              min={15}
              max={60}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Break Duration (minutes)</Label>
              <span className="text-sm text-gray-600">{preferences.breakDuration} min</span>
            </div>
            <Slider
              value={[preferences.breakDuration]}
              onValueChange={(value) => handlePreferenceChange('breakDuration', value[0])}
              min={3}
              max={15}
              step={1}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="sound">Sound Notifications</Label>
              <p className="text-sm text-gray-500">Play sound when timer completes</p>
            </div>
            <Switch
              id="sound"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => handlePreferenceChange('soundEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="auto-start">Auto-Start Breaks</Label>
              <p className="text-sm text-gray-500">Automatically start break timer</p>
            </div>
            <Switch
              id="auto-start"
              checked={preferences.autoStartBreak}
              onCheckedChange={(checked) => handlePreferenceChange('autoStartBreak', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Moon className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-gray-900">
      <Zap className="w-5 h-5" />
      Integrations
    </CardTitle>
    <CardDescription>
      Connect with educational platforms
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-3">

    {/* Google Classroom */}
    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-900">Google Classroom</p>
            <p className="text-sm text-gray-500">Not connected</p>
          </div>
        </div>

        <button
          className="
            px-4 py-2 text-sm 
            bg-[#4B2E23] 
            text-white 
            rounded-lg 
            hover:bg-[#3A241B] 
            transition
          "
        >
          Connect
        </button>
      </div>
    </div>

    {/* Moodle */}
    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-gray-900">Moodle</p>
            <p className="text-sm text-gray-500">Not connected</p>
          </div>
        </div>

        <button
          className="
            px-4 py-2 text-sm 
            bg-[#4B2E23] 
            text-white 
            rounded-lg 
            hover:bg-[#3A241B] 
            transition
          "
        >
          Connect
        </button>
      </div>
    </div>

    {/* Microsoft Teams */}
    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-900">Microsoft Teams</p>
            <p className="text-sm text-gray-500">Not connected</p>
          </div>
        </div>

        <button
          className="
            px-4 py-2 text-sm 
            bg-[#4B2E23] 
            text-white 
            rounded-lg 
            hover:bg-[#3A241B] 
            transition
          "
        >
          Connect
        </button>
      </div>
    </div>

  </CardContent>
</Card>


      {/* About */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="pt-2">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900">Chrono v1.0</h3>
            <p className="text-sm text-gray-600">
              Productivity-Based Learning App
            </p>
            <p className="text-xs text-gray-500 pt-2">
              Built to help students manage tasks, enhance focus, and reduce stress
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Logout Button */}
<button
  onClick={async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload(); // forces App.jsx to switch to LoginScreen
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }}
  className="
    w-full mt-4 
    bg-[#4B2E23] text-white 
    py-3 rounded-lg 
    font-semibold 
    hover:bg-[#3A241B] 
    transition
  "
>
  Log Out
</button>

    </div>
  );
}