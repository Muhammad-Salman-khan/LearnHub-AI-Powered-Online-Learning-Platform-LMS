"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/admin/stats-overview";
import { RecentUsersTable } from "@/components/admin/recent-users-table";
import { RecentCoursesTable } from "@/components/admin/recent-courses-table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// ⚠️ MOCK DATA (Replace with DB later)
const mockAdminStats = {
  totalUsers: 1247,
  totalCourses: 89,
  totalEnrollments: 3456,
  totalRevenue: 1250000,
};

const mockRecentUsers = [
  {
    id: "1",
    name: "Zain Ahmed",
    email: "zain@example.com",
    role: "Student",
    joinDate: "2026-04-05",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Khan",
    email: "sarah@example.com",
    role: "Instructor",
    joinDate: "2026-04-04",
    status: "Active",
  },
  {
    id: "3",
    name: "Ali Raza",
    email: "ali@example.com",
    role: "Student",
    joinDate: "2026-04-04",
    status: "Active",
  },
  {
    id: "4",
    name: "Fatima Noor",
    email: "fatima@example.com",
    role: "Admin",
    joinDate: "2026-04-03",
    status: "Active",
  },
  {
    id: "5",
    name: "Hassan Ali",
    email: "hassan@example.com",
    role: "Student",
    joinDate: "2026-04-03",
    status: "Banned",
  },
];

const mockRecentCourses = [
  {
    id: "1",
    title: "Advanced UI Design Systems",
    instructor: "Sarah Khan",
    category: "Design",
    status: "Published",
    createdDate: "2026-04-05",
    students: 850,
  },
  {
    id: "2",
    title: "Next.js 14 Full Stack",
    instructor: "Zain Ahmed",
    category: "Web Dev",
    status: "Draft",
    createdDate: "2026-04-04",
    students: 0,
  },
  {
    id: "3",
    title: "Python for Data Science",
    instructor: "Dr. Ahmed",
    category: "Data Science",
    status: "Published",
    createdDate: "2026-04-03",
    students: 420,
  },
  {
    id: "4",
    title: "DevOps Fundamentals",
    instructor: "Kamal Hassan",
    category: "DevOps",
    status: "Published",
    createdDate: "2026-04-02",
    students: 230,
  },
  {
    id: "5",
    title: "Mobile App Development",
    instructor: "Ayesha Siddiqui",
    category: "Mobile",
    status: "Draft",
    createdDate: "2026-04-01",
    students: 0,
  },
];

export default function AdminOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats] = useState(mockAdminStats);
  const [recentUsers] = useState(mockRecentUsers);
  const [recentCourses] = useState(mockRecentCourses);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* ===== BACKGROUND GLOW EFFECTS ===== */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute top-[20%] left-[15%] w-24 h-24 bg-primary/20 rounded-full blur-[60px] pointer-events-none animate-bounce"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute top-[60%] right-[20%] w-32 h-32 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none animate-bounce"
        style={{ animationDuration: "10s", animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-[30%] left-[25%] w-28 h-28 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none animate-bounce"
        style={{ animationDuration: "9s", animationDelay: "2s" }}
      />

      {/* ✅ FIXED: CSS-only grid pattern (no base64 SVG) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      {/* ===== END BACKGROUND EFFECTS ===== */}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar
          title="Platform Overview"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between relative">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
                    dashboard
                  </span>
                  Platform Overview
                </h1>
                <p className="text-muted-foreground text-sm">
                  Monitor platform health and recent activity
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-xs text-primary font-medium">
                  System Healthy
                </span>
              </div>
            </div>

            {/* Stats */}
            <StatsOverview stats={stats} />

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentUsersTable users={recentUsers} />
              <RecentCoursesTable courses={recentCourses} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[240px] p-0 bg-background border-r border-border"
        >
          <DashboardSidebar
            role="admin"
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
