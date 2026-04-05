"use client";

import { Button } from "@/components/ui/button";
import { RoleChangeDropdown } from "./role-change-dropdown";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Instructor" | "Admin";
  joinDate: string;
  status: "Active" | "Banned";
  avatar: string | null;
}

interface UserTableProps {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRoleChange: (userId: string, newRole: string) => void;
  onBanUser: (user: User) => void;
}

export function UserTable({
  users,
  totalUsers,
  currentPage,
  totalPages,
  onPageChange,
  onRoleChange,
  onBanUser,
}: UserTableProps) {
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Student":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
      case "Instructor":
        return "bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
      case "Admin":
        return "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
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
      <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Email
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                Role
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                Join Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-muted-foreground">
                        group_off
                      </span>
                    </div>
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-primary/5 transition-all duration-300 group/row table-row-glow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover/row:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
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
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
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
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <RoleChangeDropdown
                        currentRole={user.role}
                        userId={user.id}
                        onRoleChange={onRoleChange}
                        disabled={user.role === "Admin"}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBanUser(user)}
                        className={`border transition-all duration-300 hover:scale-105 ${
                          user.status === "Active"
                            ? "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                            : "border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {user.status === "Active" ? "block" : "check_circle"}
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-primary font-medium">
              {(currentPage - 1) * 20 + 1}
            </span>{" "}
            to{" "}
            <span className="text-primary font-medium">
              {Math.min(currentPage * 20, totalUsers)}
            </span>{" "}
            of <span className="text-primary font-medium">{totalUsers}</span>{" "}
            users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-border text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                chevron_left
              </span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        : "bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-border text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                chevron_right
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
