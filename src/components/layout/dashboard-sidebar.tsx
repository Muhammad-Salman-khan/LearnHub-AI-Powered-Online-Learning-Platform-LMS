"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface DashboardSidebarProps {
  role: "student" | "instructor" | "admin";
  onClose?: () => void;
}

// Spec Page 17: Sidebar Contents Per Role
const sidebarLinks = {
  student: [
    { label: "My Courses", href: "/dashboard/student", icon: "library_books" },
    {
      label: "Progress",
      href: "/dashboard/student/progress",
      icon: "analytics",
    },
    {
      label: "Certificates",
      href: "/dashboard/student/certificates",
      icon: "card_membership",
    },
    { label: "Notes", href: "/dashboard/student/notes", icon: "note" },
    {
      label: "Wishlist",
      href: "/dashboard/student/wishlist",
      icon: "favorite",
      phase: 2,
    },
  ],
  instructor: [
    { label: "Dashboard", href: "/dashboard/instructor", icon: "dashboard" },
    {
      label: "My Courses",
      href: "/dashboard/instructor/courses",
      icon: "library_books",
    },
    {
      label: "Create New",
      href: "/dashboard/instructor/courses/create",
      icon: "add_circle",
    },
    {
      label: "Analytics",
      href: "/dashboard/instructor/analytics",
      icon: "analytics",
      phase: 2,
    },
    {
      label: "Earnings",
      href: "/dashboard/instructor/earnings",
      icon: "attach_money",
      phase: 2,
    },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "dashboard" },
    { label: "Users", href: "/dashboard/admin/users", icon: "group" },
    {
      label: "Courses",
      href: "/dashboard/admin/courses",
      icon: "library_books",
    },
    {
      label: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: "analytics",
      phase: 2,
    },
    {
      label: "Reviews",
      href: "/dashboard/admin/reviews",
      icon: "rate_review",
      phase: 2,
    },
  ],
};

export function DashboardSidebar({ role, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const links = sidebarLinks[role];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col h-full bg-background border-r border-border transition-all duration-300 ease-in-out"
      style={{ width: isHovered ? "240px" : "80px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-center">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg kinetic-gradient shrink-0">
            L
          </div>
          <span
            className={`font-bold text-xl text-foreground group-hover:text-primary transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            LearnHub
          </span>
        </Link>
      </div>

      {/* Primary Nav Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto sidebar-scroll">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const isPhase2 = link.phase === 2;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
                }
                ${isPhase2 ? "opacity-60" : ""}
                ${isHovered ? "justify-start" : "justify-center"}
              `}
            >
              {/* Icon - Always Visible */}
              <span
                className={`material-symbols-outlined text-base shrink-0 ${isActive ? "text-primary" : ""}`}
              >
                {link.icon}
              </span>

              {/* Label - Hidden by Default, Shows on Hover */}
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                {link.label}
              </span>

              {/* Phase 2 Badge - Only on Hover */}
              {isPhase2 && isHovered && (
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  Phase 2
                </span>
              )}

              {/* Tooltip for Collapsed State */}
              {!isHovered && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {link.label}
                  {isPhase2 && (
                    <span className="text-muted-foreground ml-1">
                      (Phase 2)
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - User Profile */}
      <div className="p-3 border-t border-border">
        <div
          className={`glass-card-no-glow rounded-xl p-3 border border-border transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              Z
            </div>
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              <p className="text-sm font-semibold text-foreground truncate">
                Zain Ahmed
              </p>
              <p className="text-[10px] text-primary font-medium uppercase tracking-wide">
                {role}
              </p>
            </div>
          </div>

          {/* Settings & Sign Out - Only on Hover */}
          <div
            className={`space-y-1 mt-3 transition-all duration-300 ${
              isHovered
                ? "opacity-100 max-h-20"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-base">
                settings
              </span>
              Settings
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
