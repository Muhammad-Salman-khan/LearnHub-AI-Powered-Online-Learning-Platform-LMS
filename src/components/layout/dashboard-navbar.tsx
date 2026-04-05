"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardNavbarProps {
  title: string;
  role: "student" | "instructor" | "admin";
}

export function DashboardNavbar({ title, role }: DashboardNavbarProps) {
  return (
    <div className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <h1 className="font-bold text-foreground truncate">{title}</h1>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-muted/50"
          >
            <span className="material-symbols-outlined">menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[240px] p-0 bg-background border-r border-border"
        >
          <DashboardSidebar role={role} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
