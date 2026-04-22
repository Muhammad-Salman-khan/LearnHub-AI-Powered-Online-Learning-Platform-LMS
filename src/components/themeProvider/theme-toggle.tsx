"use client";

/**
 * Theme Toggle — Scholarly Architect Design System
 *
 * Toggle between light and dark modes.
 * Uses next-themes for theme management.
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: "#f0eded" }}
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined" style={{ color: "#424654" }}>
          brightness_medium
        </span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80"
      style={{
        backgroundColor: isDark ? "#2b2b2c" : "#f0eded",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="material-symbols-outlined"
        style={{ color: isDark ? "#f3f0ef" : "#424654" }}
      >
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
