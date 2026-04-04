"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { UserTable } from "@/components/admin/user/user-table";
import { UserSearchBar } from "@/components/admin/user/user-search-bar";
import { RoleFilterTabs } from "@/components/admin/user/role-filter-tabs";
import { BanUserDialog } from "@/components/admin/user/ban-user-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// ⚠️ MOCK DATA
const mockUsers = [
  {
    id: "1",
    name: "Zain Ahmed",
    email: "zain@example.com",
    role: "Student",
    joinDate: "2026-04-05",
    status: "Active",
    avatar: null,
  },
  {
    id: "2",
    name: "Sarah Khan",
    email: "sarah@example.com",
    role: "Instructor",
    joinDate: "2026-04-04",
    status: "Active",
    avatar: null,
  },
  {
    id: "3",
    name: "Ali Raza",
    email: "ali@example.com",
    role: "Student",
    joinDate: "2026-04-04",
    status: "Active",
    avatar: null,
  },
  {
    id: "4",
    name: "Fatima Noor",
    email: "fatima@example.com",
    role: "Admin",
    joinDate: "2026-04-03",
    status: "Active",
    avatar: null,
  },
  {
    id: "5",
    name: "Hassan Ali",
    email: "hassan@example.com",
    role: "Student",
    joinDate: "2026-04-03",
    status: "Banned",
    avatar: null,
  },
  {
    id: "6",
    name: "Ayesha Siddiqui",
    email: "ayesha@example.com",
    role: "Instructor",
    joinDate: "2026-04-02",
    status: "Active",
    avatar: null,
  },
  {
    id: "7",
    name: "Kamal Hassan",
    email: "kamal@example.com",
    role: "Student",
    joinDate: "2026-04-02",
    status: "Active",
    avatar: null,
  },
  {
    id: "8",
    name: "Dr. Ahmed",
    email: "ahmed@example.com",
    role: "Instructor",
    joinDate: "2026-04-01",
    status: "Active",
    avatar: null,
  },
  {
    id: "9",
    name: "Maryam Ali",
    email: "maryam@example.com",
    role: "Student",
    joinDate: "2026-04-01",
    status: "Active",
    avatar: null,
  },
  {
    id: "10",
    name: "Usman Khan",
    email: "usman@example.com",
    role: "Student",
    joinDate: "2026-03-31",
    status: "Banned",
    avatar: null,
  },
];

export default function UserManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [banDialogUser, setBanDialogUser] = useState<any>(null);
  const usersPerPage = 20;

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (roleFilter !== "all") params.set("role", roleFilter);
    router.push(`/dashboard/admin/users?${params.toString()}`, {
      scroll: false,
    });
  }, [searchQuery, roleFilter, router]);

  const handleRoleChange = (userId: string, newRole: string) => {
    console.log(`Change user ${userId} to ${newRole}`);
  };

  const handleBanUser = (user: any) => {
    setBanDialogUser(user);
  };

  const confirmBan = () => {
    if (banDialogUser) {
      console.log(
        `${banDialogUser.status === "Active" ? "Ban" : "Unban"} user ${banDialogUser.id}`,
      );
      setBanDialogUser(null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar
          title="User Management"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
                    group
                  </span>
                  User Management
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage platform users, roles, and access
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/admin")}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <span className="material-symbols-outlined text-base mr-2">
                  arrow_back
                </span>
                Back
              </Button>
            </div>

            {/* Search Bar */}
            <UserSearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Role Filter Tabs */}
            <RoleFilterTabs value={roleFilter} onChange={setRoleFilter} />

            {/* User Table */}
            <UserTable
              users={paginatedUsers}
              totalUsers={filteredUsers.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onRoleChange={handleRoleChange}
              onBanUser={handleBanUser}
            />
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

      {/* ✅ Ban Dialog - Rendered at root level, never clipped */}
      <BanUserDialog
        open={!!banDialogUser}
        onOpenChange={(open) => !open && setBanDialogUser(null)}
        user={banDialogUser}
        onConfirm={confirmBan}
      />
    </div>
  );
}
