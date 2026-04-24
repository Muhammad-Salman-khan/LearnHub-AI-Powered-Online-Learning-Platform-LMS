"use client";

/**
 * Sidebar — Scholarly Architect Design System
 *
 * Used by the student dashboard layout (and instructor via same component).
 * Desktop: fixed 240px left panel, surface-container-low bg.
 * Mobile: Sheet drawer triggered by hamburger button.
 *
 * Active nav link: primary bg + on-primary text (no borders).
 * User profile: bottom of sidebar, tonal surface-container.
 * Sign-out button: destructive red only on hover.
 *
 * Backend preserved: useSession (next-auth), signOut, role-based links.
 */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  Award,
  StickyNote,
  Heart,
  LogOut,
  Settings,
  X,
  Menu,
  Users,
  PlusCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/* ── Role-based nav links (backend logic unchanged) ──────────────── */
const getLinks = (role: string) => {
  if (role === "INSTRUCTOR") {
    return [
      { label: "Dashboard",     href: "/dashboard/instructor",         icon: LayoutDashboard, phase: 1 },
      { label: "My Courses",    href: "/dashboard/instructor/courses", icon: BookOpen,        phase: 1 },
      { label: "Create Course", href: "/dashboard/instructor/courses/create", icon: PlusCircle, phase: 1 },
      { label: "Students",      href: "/dashboard/instructor/students",icon: Users,           phase: 2 },
    ];
  }
  return [
    { label: "My Courses",  href: "/dashboard/student",              icon: BookOpen,        phase: 1 },
    { label: "Progress",    href: "/dashboard/student/progress",     icon: LayoutDashboard, phase: 2 },
    { label: "Certificates",href: "/dashboard/student/certificates", icon: Award,           phase: 2 },
    { label: "Notes",       href: "/dashboard/student/notes",        icon: StickyNote,      phase: 2 },
    { label: "Wishlist",    href: "/dashboard/student/wishlist",     icon: Heart,           phase: 2 },
  ];
};

/* ── Inner sidebar content (shared desktop + mobile) ─────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname() || "";
  const user = session?.user;
  const role = user?.role || "STUDENT";
  const links = getLinks(role);
  const userInitial = user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--surface-container-low)" }}>

      {/* Brand mark + close button */}
      <div
        className="flex h-16 items-center justify-between px-5"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <span className="material-symbols-outlined text-xl" style={{ color: "var(--primary)" }}>
            school
          </span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            LearnHub
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto sidebar-scroll">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const isPhase2 = link.phase === 2;

          return (
            <div key={link.href}>
              {isPhase2 ? (
                /* Phase 2 items — muted, not clickable */
                <span
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm"
                  style={{ color: "var(--outline-variant)", cursor: "not-allowed" }}
                >
                  <link.icon className="h-4 w-4 flex-shrink-0" />
                  {link.label}
                </span>
              ) : (
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)",
                  }}
                >
                  <link.icon className="h-4 w-4 flex-shrink-0" />
                  {link.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile section */}
      <div
        className="px-4 py-4"
        style={{ backgroundColor: "var(--surface-container-high)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--on-surface)" }}
            >
              {user?.name ?? "Loading…"}
            </p>
            <p
              className="text-xs uppercase tracking-wide"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {role.toLowerCase()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-sm transition-colors duration-150 hover:bg-red-50"
          style={{ color: "var(--error)" }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ── Default export — desktop sidebar + mobile sheet ─────────────── */
export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col"
        style={{ borderRight: "1px solid var(--border)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile: top header + sheet drawer */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4"
        style={{ backgroundColor: "var(--surface-container-lowest)", borderBottom: "1px solid var(--border)" }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              style={{ color: "var(--on-surface)" }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 border-r-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent onClose={() => {}} />
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl" style={{ color: "var(--primary)" }}>
            school
          </span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            LearnHub
          </span>
        </Link>
        <div className="w-10" />
      </header>

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
}
