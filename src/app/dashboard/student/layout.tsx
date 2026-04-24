"use client";

/**
 * StudentDashboardLayout — Scholarly Architect Design System
 *
 * Wraps the student dashboard with:
 *   - Sidebar (fixed 240px left)
 *   - Main content area (left-padded on desktop, full-width mobile)
 *   - Background: surface-container-low — workspace feel
 *   - Theme toggle support for dark mode
 */

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  /* Timeout fallback: prevent infinite loading loop */
  useEffect(() => {
    if (status === "loading") {
      const t = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  /* Brief loading state */
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
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--surface-container-low)" }}
    >
      <Sidebar />
      <main className="flex-1 lg:pl-60">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
