"use client";

import { useState, useTransition } from "react";
import { UserTable } from "@/components/admin/user/user-table";
import { UserSearchBar } from "@/components/admin/user/user-search-bar";
import { RoleFilterTabs } from "@/components/admin/user/role-filter-tabs";
import { BanUserDialog } from "@/components/admin/user/ban-user-dialog";
import { roleChangerAdminLevel } from "@/server/action"; 
import { toast } from "sonner";

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [banDialogUser, setBanDialogUser] = useState<any>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Backend Enum uppercase mangta hai: "STUDENT", "INSTRUCTOR", "ADMIN"
    const formattedRole = newRole.toUpperCase() as "STUDENT" | "INSTRUCTOR" | "ADMIN";
    
    startTransition(async () => {
      const res = await roleChangerAdminLevel(userId, formattedRole);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <UserSearchBar value={searchQuery} onChange={setSearchQuery} />
      <RoleFilterTabs value={roleFilter} onChange={setRoleFilter} />
      <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
        <UserTable
          users={filteredUsers}
          onRoleChange={handleRoleChange}
          onBanUser={setBanDialogUser}
          // baqi props...
          totalUsers={filteredUsers.length}
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* BanUserDialog component yahan add karein */}
    </>
  );
}