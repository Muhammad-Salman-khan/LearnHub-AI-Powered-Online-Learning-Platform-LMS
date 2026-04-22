"use client";

/**
 * InstructorDashboardLayout — Scholarly Architect Design System
 *
 * Wraps the instructor dashboard with theme toggle.
 * Sidebar rendered in page component.
 */

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      const t = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (status === "loading" && !timedOut) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div className="text-center space-y-4">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto"
            style={{ borderColor: "var(--primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--surface-container-low)" }}>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
