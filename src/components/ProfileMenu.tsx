import { useState } from "react";
import { User, LogOut, Settings, User2 } from "lucide-react";

interface Props {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export function ProfileMenu({ onLogout, onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center hover:bg-gray-200 transition"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>

      {open && (
        <div className="
          absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-xl
          py-2 z-50
        ">
          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-left"
            onClick={() => { setOpen(false); onNavigate("profile"); }}
          >
            <User2 className="w-4 h-4" />
            Profile
          </button>

          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-left"
            onClick={() => { setOpen(false); onNavigate("settings"); }}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <div className="border-t my-1"></div>

          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-50 text-left text-red-600"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
