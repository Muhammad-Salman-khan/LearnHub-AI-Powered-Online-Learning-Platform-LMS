"use client";

/**
 * DashboardSidebar — Scholarly Architect Design System
 *
 * Used by the instructor and admin dashboard pages.
 * Collapsible on hover: 80px (icon only) → 240px (icon + label).
 * Background: surface-container-low.
 * Active link: primary bg + on-primary text.
 * User profile: bottom section, tonal shift.
 * Uses CSS variables for dark mode support.
 *
 * Backend: useSession (next-auth), signOut preserved.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

interface DashboardSidebarProps {
  role: "student" | "instructor" | "admin";
  onClose?: () => void;
}

const sidebarLinks = {
  student: [
    { label: "My Courses", href: "/dashboard/student",          icon: "library_books" },
    { label: "Progress",   href: "/dashboard/student/progress", icon: "analytics" },
  ],
  instructor: [
    { label: "Dashboard",    href: "/dashboard/instructor",               icon: "dashboard" },
    { label: "My Courses",   href: "/dashboard/instructor/courses",       icon: "library_books" },
    { label: "Create New",   href: "/dashboard/instructor/courses/create", icon: "add_circle" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin",         icon: "dashboard" },
    { label: "Users",    href: "/dashboard/admin/users",   icon: "group" },
    { label: "Courses",  href: "/dashboard/admin/courses", icon: "library_books" },
  ],
};

export function DashboardSidebar({ role, onClose }: DashboardSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const links = sidebarLinks[role];
  const [isHovered, setIsHovered] = useState(false);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div
      className="flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: isHovered ? "240px" : "80px",
        backgroundColor: "var(--surface-container-low)",
        borderRight: "1px solid var(--border)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand mark */}
      <div
        className="flex h-16 items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4"
        >
          <span
            className="material-symbols-outlined text-xl flex-shrink-0"
            style={{ color: "var(--primary)" }}
          >
            school
          </span>
          <span
            className="font-bold text-base overflow-hidden whitespace-nowrap transition-all duration-300"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--on-surface)",
              width: isHovered ? "auto" : "0",
              opacity: isHovered ? 1 : 0,
            }}
          >
            LearnHub
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto sidebar-scroll">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-medium transition-all duration-150 ${
                isHovered ? "justify-start" : "justify-center"
              }`}
              style={{
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)",
              }}
            >
              <span
                className="material-symbols-outlined text-base flex-shrink-0"
                style={{ color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)" }}
              >
                {link.icon}
              </span>
              <span
                className="overflow-hidden whitespace-nowrap transition-all duration-300"
                style={{
                  width: isHovered ? "auto" : "0",
                  opacity: isHovered ? 1 : 0,
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div
        className="p-3 flex-shrink-0 transition-all duration-300"
        style={{ backgroundColor: "var(--surface-container-high)" }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>

          {/* Name + role */}
          <div
            className="flex-1 min-w-0 transition-all duration-300 overflow-hidden whitespace-nowrap"
            style={{
              width: isHovered ? "auto" : "0",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--on-surface)" }}
            >
              {session?.user?.name ?? "Loading…"}
            </p>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
              {role}
            </p>
          </div>
        </div>

        {/* Sign out (only shows when expanded) */}
        {isHovered && (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-xs rounded-sm transition-colors duration-150 hover:bg-red-50"
            style={{ color: "var(--error)" }}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
