"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { CreateCourseForm } from "@/components/instructor/create-course-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session && session.user.role !== "INSTRUCTOR") {
      router.push("/dashboard/student");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-primary">
        <span className="animate-pulse font-bold text-xl">Loading Experience...</span>
      </div>
    );
  }

  return (
    // Wahi Original CSS: flex, h-screen, bg-background
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      
      {/* Wahi Original Glow: absolute, blur-[120px], bg-primary/5 */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="instructor" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar
          title="Create New Course"
          role="instructor"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
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
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Wahi Original Glass Card: bg-card/30, backdrop-blur-sm, border-border */}
            <div className="glass-card-no-glow border border-border rounded-2xl overflow-hidden shadow-xl bg-card/30 backdrop-blur-sm">
              <div className="p-6 md:p-8">
                <CreateCourseForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 bg-background border-r border-border"
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