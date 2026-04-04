"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { CreateCourseForm } from "@/components/instructor/create-course-form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateCoursePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0">
        <DashboardSidebar role="instructor" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar */}
        <DashboardNavbar
          title="Create New Course"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Create a New Course
                </h1>
                <p className="text-muted-foreground mt-1">
                  Fill in the details below to create a draft course
                </p>
              </div>
              <Link href="/dashboard/instructor">
                <Button
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-base mr-2">
                    arrow_back
                  </span>
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Form */}
            <CreateCourseForm />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[240px] p-0 bg-background border-r border-border"
        >
          <DashboardSidebar
            role="instructor"
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
