/**
 * InstructorDashboardPage — Scholarly Architect Design System
 *
 * Layout:
 *   Collapsible sidebar (80px → 240px) + main content area
 *   Stats row (3-col) with left-edge accent
 *   Courses table — white cards, tonal separation
 *
 * Backend preserved:
 *   getCourseByInstructor, session auth check — no changes.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/instructor/stats-overview";
import { getCourseByInstructor } from "@/server/action";

export default async function InstructorDashboardPage() {
  /* ── Auth (backend unchanged) ────────────────────────────────────── */
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student");

  /* ── Fetch instructor courses ────────────────────────────────────── */
  const response = await getCourseByInstructor(1, 100);
  const rawCourses =
    response && response.success && response.data && Array.isArray(response.data.items)
      ? response.data.items
      : [];

  const courses = rawCourses.map((c: any) => ({
    ...c,
    status: (c.isPublished ? "published" : "draft") as "published" | "draft",
    students: c.students || c._count?.enrollments || 0,
  }));

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c: any) => c.status === "published").length,
    totalStudents: courses.reduce((acc: number, c: any) => acc + (c.students || 0), 0),
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--surface-container-low)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <DashboardSidebar role="instructor" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar title="Instructor Dashboard" role="instructor" />

        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  Instructor Portal
                </p>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  Welcome back, {session.user.name || "Instructor"}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
                  Manage your courses and track student progress
                </p>
              </div>

              {/* Create course CTA */}
              <Link
                href="/dashboard/instructor/courses/create"
                className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
              >
                <span className="material-symbols-outlined text-base">add</span>
                Create Course
              </Link>
            </div>

            {/* Stats row */}
            <StatsOverview stats={stats} />

            {/* Courses table */}
            {courses.length > 0 ? (
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
                {/* Table header */}
                <div
                  className="px-5 py-4 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}
                >
                  <div className="col-span-6">Course</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-center">Students</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table rows — no divider lines, tonal alternation */}
                <div>
                  {courses.map((course: any, index: number) => (
                    <div
                      key={course.id}
                      className="px-5 py-4 grid grid-cols-12 gap-4 items-center"
                      style={{
                        backgroundColor: index % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-variant)",
                      }}
                    >
                      <div className="col-span-6">
                        <p
                          className="font-semibold truncate"
                          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                        >
                          {course.title}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--on-surface-variant)" }}>
                          {course.category || "Uncategorized"}
                        </p>
                      </div>

                      <div className="col-span-2 text-center">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              course.status === "published"
                                ? "var(--primary-container)/15"
                                : "var(--surface-container-high)",
                            color: course.status === "published" ? "var(--primary)" : "var(--on-surface-variant)",
                          }}
                        >
                          {course.status}
                        </span>
                      </div>

                      <div className="col-span-2 text-center" style={{ color: "var(--on-surface-variant)" }}>
                        {course.students}
                      </div>

                      <div className="col-span-2 text-right">
                        <Link
                          href={`/dashboard/instructor/courses/${course.id}`}
                          className="text-sm scholar-link"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div
                className="flex flex-col items-center justify-center py-16 rounded-lg text-center"
                style={{ backgroundColor: "var(--surface-container-lowest)" }}
              >
                <span
                  className="material-symbols-outlined text-5xl mb-4"
                  style={{ color: "var(--outline-variant)" }}
                >
                  library_books
                </span>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  No courses yet
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--on-surface-variant)" }}>
                  Create your first course to get started
                </p>
                <Link
                  href="/dashboard/instructor/courses/create"
                  className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-sm hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Create Course
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
