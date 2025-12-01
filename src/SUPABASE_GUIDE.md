# Supabase Integration Guide

## ✅ What's Integrated

Your Chrono app is now fully integrated with Supabase! All your data is automatically synced to the cloud.

## 📊 Viewing Your Data in Supabase

### Method 1: In-App Data Viewer (Easiest)
1. Open the Chrono app
2. Go to the **Settings** tab (bottom navigation)
3. Click **"Fetch Data from Supabase"** in the Data Viewer card
4. You'll see all your tasks, focus sessions, and user data

### Method 2: Supabase Dashboard
1. Go to: `https://supabase.com/dashboard`
2. Sign in to your Supabase account
3. Select your project
4. Navigate to: **Table Editor** → **kv_store_c9339a2a**
5. You'll see your data stored with these keys:
   - `chrono:tasks` - All your tasks and subtasks
   - `chrono:focus-sessions` - All your focus timer sessions
   - `chrono:user-data` - Your streak, points, badges, and stats

## 🔄 How Sync Works

### Automatic Syncing
- Every time you add, update, or delete a task → Synced to Supabase
- Every time you complete a focus session → Synced to Supabase
- Every time you earn points or badges → Synced to Supabase

### Sync Status Indicator
Look at the top-right corner of the app:
- 🌥️ **"Syncing..."** - Data is being uploaded
- ☁️ **"Synced"** (green) - Everything is backed up
- ☁️ **"Offline"** (orange) - Using local storage only

## 📱 Data Storage

### What's Stored:
1. **Tasks**: All your assignments with subtasks, due dates, priorities
2. **Focus Sessions**: Complete history of your Pomodoro sessions
3. **User Data**: Streak count, total points, badges earned, focus stats

### Data Structure:
```javascript
// chrono:tasks
[
  {
    id: "task-123",
    title: "Complete Math Assignment",
    description: "Solve problems 1-20",
    subject: "Mathematics",
    dueDate: "2025-12-15",
    priority: "high",
    estimatedHours: 4,
    completed: false,
    subtasks: [...],
    createdAt: "2025-12-01T10:00:00Z"
  }
]

// chrono:focus-sessions
[
  {
    id: "session-456",
    startTime: "2025-12-01T14:30:00Z",
    duration: 25,
    completed: true
  }
]

// chrono:user-data
{
  streak: 7,
  totalPoints: 450,
  badges: [...],
  totalFocusSessions: 12,
  totalFocusMinutes: 300
}
```

## 🔐 Data Privacy

- All data is stored in your personal Supabase project
- Only accessible with your project credentials
- Data persists even if you clear browser cache
- Sync across multiple devices (same Supabase project)

## 🛠️ Technical Details

### Backend Endpoints:
- `GET /make-server-c9339a2a/tasks` - Fetch all tasks
- `POST /make-server-c9339a2a/tasks` - Save tasks
- `GET /make-server-c9339a2a/focus-sessions` - Fetch sessions
- `POST /make-server-c9339a2a/focus-sessions` - Save sessions
- `GET /make-server-c9339a2a/user-data` - Fetch user stats
- `POST /make-server-c9339a2a/user-data` - Save user stats

### Storage:
- Uses Supabase Key-Value store (`kv_store_c9339a2a` table)
- Automatic localStorage fallback if offline
- Data syncs on app load and after every change

## 🐛 Troubleshooting

### "Offline" Status Showing?
- Check your internet connection
- Check browser console for error messages
- Verify Supabase project is running

### Data Not Appearing in Supabase?
1. Go to Settings → Data Viewer
2. Click "Fetch Data from Supabase"
3. Check browser console for errors
4. Try adding a new task to trigger a sync

### Want to Reset Data?
- Clear browser localStorage
- Delete rows from Supabase table
- Refresh the app

## 📈 Next Steps

Consider adding:
- User authentication (sign up/login)
- Multi-device sync with user accounts
- Real-time collaboration features
- Cloud backup and restore
- Data export functionality
