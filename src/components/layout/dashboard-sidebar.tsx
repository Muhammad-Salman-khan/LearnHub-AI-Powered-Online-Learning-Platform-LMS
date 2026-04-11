"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react"; // ✅ NextAuth hooks for backend connection

interface DashboardSidebarProps {
  role: "student" | "instructor" | "admin";
  onClose?: () => void;
}

const sidebarLinks = {
  student: [
    { label: "My Courses", href: "/dashboard/student", icon: "library_books" },
    { label: "Progress", href: "/dashboard/student/progress", icon: "analytics", phase: 2 },
    { label: "Certificates", href: "/dashboard/student/certificates", icon: "card_membership", phase: 2 },
    { label: "Notes", href: "/dashboard/student/notes", icon: "note", phase: 2 },
  ],
  instructor: [
    { label: "Dashboard", href: "/dashboard/instructor", icon: "dashboard" },
    { label: "My Courses", href: "/dashboard/instructor/courses", icon: "library_books" },
    { label: "Create New", href: "/dashboard/instructor/courses/create", icon: "add_circle" },
    { label: "Analytics", href: "/dashboard/instructor/analytics", icon: "analytics", phase: 2 },
    { label: "Earnings", href: "/dashboard/instructor/earnings", icon: "attach_money", phase: 2 },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "dashboard" },
    { label: "Users", href: "/dashboard/admin/users", icon: "group" },
    { label: "Courses", href: "/dashboard/admin/courses", icon: "library_books" },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: "analytics", phase: 2 },
    { label: "Reviews", href: "/dashboard/admin/reviews", icon: "rate_review", phase: 2 },
  ],
};

export function DashboardSidebar({ role, onClose }: DashboardSidebarProps) {
  const { data: session } = useSession(); // ✅ Backend session access
  const pathname = usePathname();
  const links = sidebarLinks[role];
  const [isHovered, setIsHovered] = useState(false);

  // User ke naam ka pehla letter nikalne ke liye logic
  const userInitial = session?.user?.name ? session.user.name[0].toUpperCase() : "U";

  return (
    <div
      className="flex flex-col h-full bg-background border-r border-border transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: isHovered ? "240px" : "80px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border flex items-center justify-center">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg kinetic-gradient shrink-0">
            L
          </div>
          <span
            className={`font-bold text-xl text-foreground group-hover:text-primary transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            LearnHub
          </span>
        </Link>
      </div>

      {/* Nav Links */}
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
                ${isActive ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"}
                ${isPhase2 ? "opacity-60" : ""}
                ${isHovered ? "justify-start" : "justify-center"}
              `}
            >
              <span className={`material-symbols-outlined text-base shrink-0 transition-all duration-300 ${isActive ? "text-primary" : ""}`}>
                {link.icon}
              </span>
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isHovered ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ✅ Backend Connected User Profile */}
      <div className="p-3 border-t border-border">
        <div className={`glass-card-no-glow rounded-xl p-3 border border-border transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-70"}`}>
          <div className="flex items-center gap-3">
            {/* User Avatar - Shows Image if exists, else Initial */}
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="profile" width={40} height={40} className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
              <p className="text-sm font-semibold text-foreground truncate">
                {session?.user?.name || "Loading..."} 
              </p>
              <p className="text-[10px] text-primary font-medium uppercase tracking-wide">
                {role}
              </p>
            </div>
          </div>

          {/* Settings & Sign Out */}
          <div className={`space-y-1 mt-3 transition-all duration-300 ${isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-base">settings</span>
              Settings
            </button>
            {/* ✅ Functional Sign Out */}
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}