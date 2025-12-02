import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";   // <-- correct path for your project
import { useTaskStore } from "../store/taskStore";
import { useFocusStore } from "../store/focusStore";
import { User, Mail, School, BookOpen, Star } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  university: string | null;
  degree: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { streak, totalPoints, badges } = useTaskStore();
  const { totalFocusSessions, totalFocusMinutes } = useFocusStore();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        console.warn("No logged-in user");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (!profile) {
    return (
      <div className="p-4 text-center text-red-600">
        Profile not found. Check RLS policies.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>

      <div className="p-6 bg-white border rounded-xl shadow">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium">{profile.name || "Unnamed User"}</h3>
            <p className="text-gray-500">{profile.username}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" /> {profile.email}
          </div>

          {profile.university && (
            <div className="flex items-center gap-3">
              <School className="w-5 h-5 text-gray-600" /> {profile.university}
            </div>
          )}

          {profile.degree && (
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gray-600" /> {profile.degree}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Streak" value={`${streak} days`} />
        <StatBox label="Focus Sessions" value={totalFocusSessions} />
        <StatBox label="Focus Minutes" value={totalFocusMinutes} />
        <StatBox label="Points" value={totalPoints} />
      </div>

      {/* Badges */}
      <div className="p-6 bg-white border rounded-xl shadow">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>

        {badges.length === 0 ? (
          <p className="text-gray-500 mt-2">No badges yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {badges.map((b, i) => (
              <div key={i} className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl">{b.icon}</div>
                <p>{b.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="p-4 bg-gray-50 border rounded-xl text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
