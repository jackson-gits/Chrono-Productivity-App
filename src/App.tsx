import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { FocusTimer } from './components/FocusTimer';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Home, CheckSquare, Timer, BarChart3, SettingsIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'focus':
        return <FocusTimer />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-indigo-900">Chrono</h1>
                <p className="text-gray-500 text-sm">Productivity-Based Learning</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center py-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'tasks'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <CheckSquare className="w-6 h-6" />
              <span className="text-xs">Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'focus'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Timer className="w-6 h-6" />
              <span className="text-xs">Focus</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
