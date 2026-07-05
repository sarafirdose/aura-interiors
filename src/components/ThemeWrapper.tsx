"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const ambientMode = useStore((state) => state.ambientMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (ambientMode === "day") {
      root.classList.add("day-mode");
      root.classList.remove("night-mode");
    } else {
      root.classList.add("night-mode");
      root.classList.remove("day-mode");
    }
  }, [ambientMode, mounted]);

  // Prevent flash by staying hidden or rendering basic shell until store is rehydrated
  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <div className="w-full min-h-screen transition-colors duration-1000">
      {children}
    </div>
  );
}
