import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";

// Components
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import UserManagementClient from "./user-management-client";

// ✅ Backend Action
import { getAllUsers } from "@/server/action";

export default async function UserManagementPage() {
  // 1. Auth & Admin Check
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/login");
  // }

  // 2. Fetch Real Users from DB
  const response = await getAllUsers();
  const dbUsers = (response.success ? response.data : []) ?? [];

  // 3. Formatting data for the table
  const formattedUsers = dbUsers.map((user: any) => ({
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email,
    role: user.role, // Student, Instructor, Admin
    joinDate: new Date(user.createdAt).toLocaleDateString(),
    status: user.isBanned ? "Banned" : "Active", // Agar aapke schema mein isBanned hai
    avatar: user.image || null,
  }));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Glows (Aapka original CSS) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main Content Area - Passing data to Client Component for Search/Filter */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Navbar mein role pass kiya taake error na aaye */}
        <DashboardNavbar title="User Management" role="admin" />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3 text-glow">
                  <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
                    group
                  </span>
                  User Management
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage platform users, roles, and access
                </p>
              </div>
            </div>

            {/* ✅ Client Side Logic Wrapper */}
            <UserManagementClient initialUsers={formattedUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
