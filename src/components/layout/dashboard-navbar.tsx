"use client";

/**
 * DashboardNavbar — Scholarly Architect Design System
 *
 * Sticky top bar for instructor/admin dashboards.
 * Background: surface-container-lowest with subtle border.
 * Left: hamburger (mobile) + page title.
 * Right: role badge (primary blue pill).
 * Uses CSS variables for dark mode support.
 *
 * Backend: Sheet for mobile sidebar preserved.
 */

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";
import { useState } from "react";

interface DashboardNavbarProps {
  title: string;
  role: "student" | "instructor" | "admin";
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function DashboardNavbar({ title, role, sidebarOpen, setSidebarOpen }: DashboardNavbarProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = sidebarOpen !== undefined ? sidebarOpen : internalOpen;
  const onOpenChange = setSidebarOpen !== undefined ? setSidebarOpen : setInternalOpen;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-50"
      style={{
        backgroundColor: "var(--surface-container-lowest)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              style={{ color: "var(--on-surface)" }}
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] p-0 border-r-0"
          >
            <DashboardSidebar role={role} onClose={() => onOpenChange(false)} />
          </SheetContent>
        </Sheet>

        {/* Page title */}
        <h1
          className="font-bold text-lg truncate max-w-[200px] md:max-w-none"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          {title}
        </h1>
      </div>

      {/* Role badge + Theme Toggle */}
      <div className="flex items-center gap-3">
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: "var(--primary-container)/15",
            color: "var(--primary)",
          }}
        >
          {role}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
