"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Instructor" | "Admin";
  joinDate: string;
  status: "Active" | "Banned";
}

interface RecentUsersTableProps {
  users: User[];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Student":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]";
      case "Instructor":
        return "bg-primary/10 text-primary border-primary/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]";
      case "Admin":
        return "bg-red-500/10 text-red-400 border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card-no-glow rounded-xl border border-border overflow-hidden relative group">
      {/* Animated Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="p-5 border-b border-border flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-shadow duration-300">
            <span className="material-symbols-outlined text-blue-400 text-2xl">
              group
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Recent Users
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {users.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Last 10 registrations
            </p>
          </div>
        </div>
        <Link href="/dashboard/admin/users">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 text-xs transition-all"
          >
            View All
            <span className="material-symbols-outlined text-base ml-1">
              arrow_forward
            </span>
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto relative">
        {/* Table Header Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Role
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                Joined
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-blue-500/5 transition-all duration-300 group/row"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover/row:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate max-w-[150px] group-hover/row:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-300 hover:scale-105 ${getRoleBadgeStyle(user.role)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/30">
                    <span className="material-symbols-outlined text-xs text-primary">
                      calendar_today
                    </span>
                    {formatDate(user.joinDate)}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-300 ${
                      user.status === "Active"
                        ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        : "bg-destructive/10 text-destructive border-destructive/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-400 animate-pulse" : "bg-destructive"}`}
                    />
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
