"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/instructor/stats-overview";
import { CoursesTable } from "@/components/instructor/courses-table";
import { EmptyState } from "@/components/instructor/empty-state";
import { CreateCourseBtn } from "@/components/instructor/create-course-btn";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

// ⚠️ MOCK DATA
const mockInstructor = {
  name: "Zain Ahmed",
  stats: {
    totalCourses: 12,
    totalStudents: 1450,
    publishedCourses: 8,
  },
  courses: [
    {
      id: "1",
      title: "Advanced UI Design Systems",
      category: "Design",
      status: "published",
      students: 850,
      thumbnail: "/courses/ui-design.jpg",
    },
    {
      id: "2",
      title: "Next.js 14 Full Stack",
      category: "Web Dev",
      status: "draft",
      students: 0,
      thumbnail: "/courses/nextjs.jpg",
    },
  ],
};
export default function InstructorDashboardPage() {
  const { name, stats, courses } = mockInstructor;
  const session = useSession();
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar - Spec: 240px Fixed Left */}
      <div className="hidden md:block w-[240px] flex-shrink-0">
        <DashboardSidebar role="instructor" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar */}
        <DashboardNavbar title="Instructor Dashboard" role="instructor" />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {session.data?.user.name} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your courses and track student progress
                </p>
              </div>
              <CreateCourseBtn />
            </div>

            {/* Spec Page 7: 3 Stat Chips */}
            <StatsOverview stats={stats} />

            {/* Spec Page 7: My Courses Table or Empty State */}
            {courses.length > 0 ?
              <CoursesTable courses={courses} />
            : <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
}
