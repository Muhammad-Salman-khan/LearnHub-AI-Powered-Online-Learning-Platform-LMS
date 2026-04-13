import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";

// Components
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/admin/stats-overview";
import { RecentUsersTable } from "@/components/admin/recent-users-table";
import { RecentCoursesTable } from "@/components/admin/recent-courses-table";

// ✅ Sirf aapke maujooda actions use ho rahe hain
import { getAllCourses, getAllUsers } from "@/server/action";

export default async function AdminOverviewPage() {
  // 1. Auth & Role Check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // 2. Data Fetching (stats only, fetch small page)
  const [coursesRes, usersRes] = await Promise.all([
    getAllCourses(1, 100),
    getAllUsers(1, 100),
  ]);

  const dbCourses = (coursesRes.success && coursesRes.data ? coursesRes.data.items : []) ?? [];
  const dbUsers = (usersRes.success && usersRes.data ? usersRes.data.items : []) ?? [];

  // 3. Stats Calculation (Bina alag action ke)
  const stats = {
    totalUsers: dbUsers.length,
    totalCourses: dbCourses.length,
    totalEnrollments: 0, // Iske liye enrollment table ka action chahiye hoga baad mein
    totalRevenue: dbCourses.reduce(
      (acc: number, curr: { price?: number }) => acc + (curr.price || 0),
      0,
    ), // Base calculation
  };

  // Recent data for tables (Top 5)
  const recentUsers = dbUsers.slice(0, 5);
  const recentCourses = dbCourses.slice(0, 5);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* ===== BACKGROUND EFFECTS (Aapka Original CSS) ===== */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      {/* ===== END BACKGROUND EFFECTS ===== */}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar title="Platform Overview" role="admin" />

        <div className="flex-1 overflow-y-auto p-0">
          <div className="w-full px-6 py-6 space-y-6">
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

            {/* Stats Overview */}
            <StatsOverview stats={stats} />

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users Table */}
              <RecentUsersTable users={recentUsers} />

              {/* Courses Table */}
              <RecentCoursesTable courses={recentCourses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
