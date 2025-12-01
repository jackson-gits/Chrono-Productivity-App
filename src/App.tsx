import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { TaskManager } from "./components/TaskManager";
import { FocusTimer } from "./components/FocusTimer";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import {
  Home,
  CheckSquare,
  Timer,
  BarChart3,
  SettingsIcon,
  Cloud,
  CloudOff
} from "lucide-react";
import { useSupabaseSync } from "./hooks/useSupabaseSync";
import { SplashScreen } from "./components/splash";
import { LoginScreen } from "./components/login";
import Logo from "./assets/logo.png";

import { AnimatePresence, motion } from "framer-motion";

async function fakeLogin(email, password) {
  await new Promise((r) => setTimeout(r, 1000));
  return true;
}

async function fakeSignUp(email, password) {
  await new Promise((r) => setTimeout(r, 1000));
  return true;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { isLoading, error } = useSupabaseSync();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TaskManager />;
      case "focus":
        return <FocusTimer />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={async (email, password) => {
          await fakeLogin(email, password);
          setIsAuthenticated(true);
        }}
        onSignUp={async (email, password) => {
          await fakeSignUp(email, password);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER FIXED */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
    <div className="flex items-center justify-between">

      {/* Logo + Title */}
      <div className="flex items-center gap-3">

        {/* Fully-Filled Rounded Image */}
        <div className="h-12 w-17 rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <img
            src={Logo}
            alt="Chrono Logo"
            className="
              h-16   w-16 
              object-cover 
              object-center
              block
            "
          />
        </div>

        <div className="leading-tight">
          <h1 className="text-gray-900 font-semibold text-lg">Chrono</h1>
          <p className="text-gray-500 text-sm">Productivity-Based Learning</p>
        </div>
      </div>

      {/* Sync Status */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Cloud className="w-4 h-4 animate-pulse" />
            <span>Syncing...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-1 text-red-600 text-sm">
            <CloudOff className="w-4 h-4" />
            <span>Offline</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <Cloud className="w-4 h-4" />
            <span>Synced</span>
          </div>
        )}
      </div>

    </div>
  </div>
</header>


      {/* MAIN CONTENT - WHITE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 bg-white min-h-[calc(100vh-120px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* NAVBAR FIXED */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-around items-center py-3">

      {/* Home */}
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
          activeTab === "dashboard"
            ? "text-[#4B2E23] bg-[#FFE7C2]"          // Active
            : "text-[#7B5A4A] hover:bg-[#FFF2D9]"   // Inactive
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs font-medium">Home</span>
      </button>

      {/* Tasks */}
      <button
        onClick={() => setActiveTab("tasks")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
          activeTab === "tasks"
            ? "text-[#4B2E23] bg-[#FFE7C2]"
            : "text-[#7B5A4A] hover:bg-[#FFF2D9]"
        }`}
      >
        <CheckSquare className="w-6 h-6" />
        <span className="text-xs font-medium">Tasks</span>
      </button>

      {/* Focus */}
      <button
        onClick={() => setActiveTab("focus")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
          activeTab === "focus"
            ? "text-[#4B2E23] bg-[#FFE7C2]"
            : "text-[#7B5A4A] hover:bg-[#FFF2D9]"
        }`}
      >
        <Timer className="w-6 h-6" />
        <span className="text-xs font-medium">Focus</span>
      </button>

      {/* Analytics */}
      <button
        onClick={() => setActiveTab("analytics")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
          activeTab === "analytics"
            ? "text-[#4B2E23] bg-[#FFE7C2]"
            : "text-[#7B5A4A] hover:bg-[#FFF2D9]"
        }`}
      >
        <BarChart3 className="w-6 h-6" />
        <span className="text-xs font-medium">Analytics</span>
      </button>

      {/* Settings */}
      <button
        onClick={() => setActiveTab("settings")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
          activeTab === "settings"
            ? "text-[#4B2E23] bg-[#FFE7C2]"
            : "text-[#7B5A4A] hover:bg-[#FFF2D9]"
        }`}
      >
        <SettingsIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Settings</span>
      </button>

    </div>
  </div>
</nav>

    </div>
  );
}
