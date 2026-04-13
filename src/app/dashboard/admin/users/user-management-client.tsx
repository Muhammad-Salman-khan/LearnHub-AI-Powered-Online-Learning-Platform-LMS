"use client";

import { useState, useTransition } from "react";
import { UserTable } from "@/components/admin/user/user-table";
import { UserSearchBar } from "@/components/admin/user/user-search-bar";
import { RoleFilterTabs } from "@/components/admin/user/role-filter-tabs";
import { BanUserDialog } from "@/components/admin/user/ban-user-dialog";
import { roleChangerAdminLevel } from "@/server/action";
import { toast } from "sonner";

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [banDialogUser, setBanDialogUser] = useState<any>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const formattedRole = newRole.toUpperCase() as "STUDENT" | "INSTRUCTOR" | "ADMIN";
    
    // Find the user and store old role for revert
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return;
    
    const oldRole = users[userIndex].role;
    
    // Instantly update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: formattedRole } : u
      )
    );

    startTransition(async () => {
      const res = await roleChangerAdminLevel(userId, formattedRole);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
        // Revert if server fails
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role: oldRole } : u
          )
        );
      }
    });
  };

  const handleBanUser = async () => {
    if (!banDialogUser) return;

    // For now, just show a toast since we don't have isBanned field in schema
    toast.info(`Ban functionality requires database schema update. User: ${banDialogUser.name}`);
    setBanDialogUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <UserSearchBar value={searchQuery} onChange={setSearchQuery} />
      <RoleFilterTabs value={roleFilter} onChange={setRoleFilter} />
      {/* No loading overlay - instant updates */}
      <UserTable
        users={filteredUsers}
        onRoleChange={handleRoleChange}
        onBanUser={setBanDialogUser}
        totalUsers={filteredUsers.length}
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />

      <BanUserDialog
        open={!!banDialogUser}
        onOpenChange={(open) => !open && setBanDialogUser(null)}
        user={banDialogUser}
        onConfirm={handleBanUser}
      />
    </>
  );
}