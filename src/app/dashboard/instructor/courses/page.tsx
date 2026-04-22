import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { CoursesTable } from "@/components/instructor/courses-table";
import { EmptyState } from "@/components/instructor/empty-state";
import { CreateCourseBtn } from "@/components/instructor/create-course-btn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseByInstructor } from "@/server/action";
import { redirect } from "next/navigation";

/**
 * InstructorCoursesListPage — Scholarly Architect Design System
 *
 * Course management for instructors.
 * Background: surface-container-low (#f6f3f2)
 */

export default async function InstructorCoursesListPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student");

  const response = await getCourseByInstructor(1, 100);
  const rawCourses =
    response && response.success && response.data && Array.isArray(response.data.items)
      ? response.data.items
      : [];

  const formattedCourses = rawCourses.map((course: any) => ({
    ...course,
    status: (course.isPublished ? "published" : "draft") as "published" | "draft",
    students: course.students || course._count?.enrollments || 0,
  }));

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#f6f3f2" }}>
      <div className="hidden md:block flex-shrink-0">
        <DashboardSidebar role="instructor" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar title="My Courses" role="instructor" />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#0040a1" }}
                >
                  Course Management
                </p>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
                >
                  Manage Courses
                </h1>
              </div>
              <CreateCourseBtn />
            </div>

            {formattedCourses.length > 0 ? (
              <CoursesTable courses={formattedCourses} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
