import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { getAllUsers } from "@/server/action";
import UserManagementClient from "./user-management-client";
export default async function AdminUsersPage() {
  // 1. Session check aur Admin role validation
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Agar user login hai lekin Admin nahi hai, to student dashboard bhej do
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  // 2. Sirf Admin hone par hi data fetch hoga
  const response = await getAllUsers(1, 100);
  const dbUsers = (response.success && response.data ? response.data.items : []) ?? [];

  const formattedUsers = dbUsers.map((user: { id: string; name: string; email: string; role: string; createdAt: Date }) => ({
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email,
    role: user.role,
    joinDate: new Date(user.createdAt).toLocaleDateString(),
    status: "Active", // TODO: add isBanned field to User model
    avatar: null, // TODO: add image field to User model
  }));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Glow Effects (Same CSS) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Role prop added to fix the previous error */}
        <DashboardNavbar title="User Management" role="admin" />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <UserManagementClient initialUsers={formattedUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
