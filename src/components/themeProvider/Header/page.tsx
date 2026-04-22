"use client";

/**
 * Header — Scholarly Architect Design System
 *
 * Sticky top navigation for public pages.
 * Background: surface (#fcf9f8), no border separator.
 * Brand: account_balance icon + LearnHub text.
 * Nav: Explore (active), My Learning, Resources.
 * Right: Search icon + Theme Toggle + Profile avatar.
 */

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "../theme-toggle";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name || "User";
  const userRole = session?.user?.role || "student";

  // Determine dashboard route based on role
  const dashboardRoute =
    userRole === "ADMIN"
      ? "/dashboard/admin"
      : userRole === "INSTRUCTOR"
        ? "/dashboard/instructor"
        : "/dashboard/student";

  return (
    <header
      className="w-full top-0 sticky z-50"
      style={{ backgroundColor: "var(--background)" }}
    >
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tighter"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ color: "var(--primary)" }}
          >
            account_balance
          </span>
          LearnHub
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/courses"
            className="font-bold text-lg tracking-tight border-b-2 pb-1 transition-colors"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--primary)",
              borderColor: "var(--primary)",
            }}
          >
            Explore
          </Link>
          <Link
            href={isLoggedIn ? dashboardRoute : "/login"}
            className="font-bold text-lg tracking-tight hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface-variant)" }}
          >
            My Learning
          </Link>
          <Link
            href="/resources"
            className="font-bold text-lg tracking-tight hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface-variant)" }}
          >
            Resources
          </Link>
        </div>

        {/* Right side: Search + Theme + Profile */}
        <div className="flex items-center gap-4">
          {/* Search - hidden on mobile */}
          <button
            className="hidden md:flex material-symbols-outlined cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: "var(--on-surface-variant)" }}
            aria-label="Search"
          >
            search
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden material-symbols-outlined cursor-pointer"
            style={{ color: "var(--on-surface-variant)" }}
            aria-label="Menu"
          >
            menu
          </button>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <Link
              href={dashboardRoute}
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--surface-container-high)" }}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  person
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded font-bold text-sm tracking-tight transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-headline)",
                backgroundColor: "var(--primary)",
                color: "var(--on-primary)",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden px-6 py-4"
          style={{
            backgroundColor: "var(--background)",
            borderTop: "1px solid var(--surface-container)",
          }}
        >
          <nav className="flex flex-col gap-4">
            <Link
              href="/courses"
              className="font-bold text-base py-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href={isLoggedIn ? dashboardRoute : "/login"}
              className="font-bold text-base py-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface-variant)" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Learning
            </Link>
            <Link
              href="/resources"
              className="font-bold text-base py-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface-variant)" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resources
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
