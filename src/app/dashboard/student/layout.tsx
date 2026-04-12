"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  // Timeout fallback: if loading takes > 5s, show content anyway
  // (prevents infinite loading loop when session is cached but slow to resolve)
  useEffect(() => {
    if (status === "loading") {
      const timer = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Show loading state (only briefly)
  if (status === "loading" && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316] mx-auto"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If still loading after timeout, assume authenticated (session is cached)
  // If explicitly unauthenticated, redirect to login
  if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e0e] text-gray-200">
      {/* Sidebar handles its own responsive display */}
      <Sidebar />

      {/* Main Content - Section 07: Scrollable right panel */}
      <main className="flex-1 lg:pl-[240px]">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
