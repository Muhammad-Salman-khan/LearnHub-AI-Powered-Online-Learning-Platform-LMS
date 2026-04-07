"use client";

import { useState } from "react";
import { UserTable } from "@/components/admin/user/user-table";
import { UserSearchBar } from "@/components/admin/user/user-search-bar";
import { RoleFilterTabs } from "@/components/admin/user/role-filter-tabs";
import { BanUserDialog } from "@/components/admin/user/ban-user-dialog";

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [banDialogUser, setBanDialogUser] = useState<any>(null);
  const usersPerPage = 10;

  // Real-time Filtering logic
  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = 
      roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <>
      <UserSearchBar value={searchQuery} onChange={setSearchQuery} />
      <RoleFilterTabs value={roleFilter} onChange={setRoleFilter} />

      <UserTable
        users={paginatedUsers}
        totalUsers={filteredUsers.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRoleChange={(id, role) => console.log(id, role)}
        onBanUser={(user) => setBanDialogUser(user)}
      />

      <BanUserDialog
        open={!!banDialogUser}
        onOpenChange={(open) => !open && setBanDialogUser(null)}
        user={banDialogUser}
        onConfirm={() => {
            console.log("User Action Confirmed");
            setBanDialogUser(null);
        }}
      />
    </>
  );
}