import { useEffect, useState } from "react";
import Logo from "../assets/logoslo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => onComplete(), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 
        bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50
        flex items-center justify-center z-50
        transition-opacity duration-500
        ${!isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      <div className="flex flex-col items-center gap-6">

        {/* Logo + glow */}
        <div className="relative">
          {/* soft glow behind */}
          <div
            className="
              absolute inset-0 
              bg-amber-300 
              rounded-full 
              blur-3xl 
              opacity-40 
              animate-pulse
            "
          />

          {/* big logo with grid background, no border */}
{/* big logo fully filled, no empty space */}
<div
  className="
    relative
    w-44 h-
    rounded-2xl
    overflow-hidden
    shadow-[0_18px_45px_rgba(0,0,0,0.18)]
  "
>
  <img
    src={Logo}
    alt="Chrono Logo"
    className="w-full h-full object-cover"
  />
</div>

        </div>

        {/* Title + subtitle */}
        <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: "#4A2C2A" }}>
  Chrono
</h1>

<p className="mt-1 text-sm" style={{ color: "#6A443F" }}>
  Master your time with clarity
</p>

        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
  <div
    className="w-2.5 h-2.5 rounded-full animate-bounce"
    style={{ backgroundColor: "#4A2C2A" }}
  ></div>

  <div
    className="w-2.5 h-2.5 rounded-full animate-bounce"
    style={{ backgroundColor: "#4A2C2A", animationDelay: "0.12s" }}
  ></div>

  <div
    className="w-2.5 h-2.5 rounded-full animate-bounce"
    style={{ backgroundColor: "#4A2C2A", animationDelay: "0.24s" }}
  ></div>
</div>

      </div>
    </div>
  );
}
