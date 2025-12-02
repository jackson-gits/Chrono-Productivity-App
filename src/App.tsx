import { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { TaskManager } from "./components/TaskManager";
import { FocusTimer } from "./components/FocusTimer";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { ProfileMenu } from "./components/ProfileMenu";
import { Profile } from "./components/Profile";

import {
  Home,
  CheckSquare,
  Timer,
  BarChart3,
  Cloud,
  CloudOff,
} from "lucide-react";

import { supabase } from "./utils/supabase";
import { useSupabaseSync } from "./hooks/useSupabaseSync";

import { SplashScreen } from "./components/splash";
import { LoginScreen } from "./components/login";
import Logo from "./assets/logo.png";

import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { isLoading, error } = useSupabaseSync();

  // -------------------------------------------------------
  // Ensure user profile exists for Email + Google
  // -------------------------------------------------------
  async function ensureProfile(user) {
    if (!user) return;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from("user_profiles").insert({
        id: user.id,
        email: user.email,
        username: `user_${user.id.slice(0, 8)}`,
        name: user.user_metadata?.full_name || null,
        university: null,
        degree: null,
        avatar_url: user.user_metadata?.avatar_url || null,
      });
    }
  }

  // -------------------------------------------------------
  // AUTH HANDLING (Login, Google, Refresh)
  // -------------------------------------------------------
  useEffect(() => {
    let ignore = false;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!ignore && session?.user) {
        await ensureProfile(session.user);
        setIsAuthenticated(true);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!ignore) {
          if (session?.user) {
            await ensureProfile(session.user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  // -------------------------------------------------------
  // EMAIL LOGIN
  // -------------------------------------------------------
  const handleEmailLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  // -------------------------------------------------------
  // EMAIL SIGNUP
  // -------------------------------------------------------
  const handleEmailSignup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    await ensureProfile(data.user);
  };

  // -------------------------------------------------------
  // PAGE SWITCH
  // -------------------------------------------------------
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
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Splash
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Login
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={handleEmailLogin}
        onSignUp={handleEmailSignup}
      />
    );
  }

  // -------------------------------------------------------
  // MAIN APP
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-17 rounded-xl overflow-hidden shadow-sm border">
              <img src={Logo} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-gray-900 font-semibold text-lg">Chrono</h1>
              <p className="text-gray-500 text-sm">Productivity-Based Learning</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* SYNC INDICATOR */}
            <div className="bg-gray-50 px-3 py-1.5 rounded-full border shadow-sm text-sm flex items-center gap-1">
              {isLoading ? (
                <>
                  <Cloud className="w-4 h-4 animate-pulse" />
                  <span>Syncing…</span>
                </>
              ) : error ? (
                <>
                  <CloudOff className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Offline</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Synced</span>
                </>
              )}
            </div>

            {/* PROFILE MENU */}
            <ProfileMenu
              onLogout={() => supabase.auth.signOut()}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around py-3">
        <NavButton label="Home" icon={Home} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
        <NavButton label="Tasks" icon={CheckSquare} active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
        <NavButton label="Focus" icon={Timer} active={activeTab === "focus"} onClick={() => setActiveTab("focus")} />
        <NavButton label="Analytics" icon={BarChart3} active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
      </div>
    </nav>
  );
}

function NavButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
        active ? "text-[#4B2E23] bg-[#FFE7C2]" : "text-[#7B5A4A] hover:bg-[#FFF2D9]"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
