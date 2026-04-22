/**
 * AdminOverviewPage — Scholarly Architect Design System
 *
 * Layout:
 *   Collapsible sidebar + main content
 *   4-col stats bento grid (left-edge accent)
 *   2-col tables: Recent Users + Recent Courses
 *
 * Backend preserved:
 *   getAllCourses, getAllUsers — no changes.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/admin/stats-overview";
import { getAllCourses, getAllUsers } from "@/server/action";

export default async function AdminOverviewPage() {
  /* ── Auth (backend unchanged) ────────────────────────────────────── */
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  /* ── Fetch data ───────────────────────────────────────────────────── */
  const [coursesRes, usersRes] = await Promise.all([
    getAllCourses(1, 100),
    getAllUsers(1, 100),
  ]);

  const courses =
    coursesRes.success && coursesRes.data ? coursesRes.data.items : [];
  const users =
    usersRes.success && usersRes.data ? usersRes.data.items : [];

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    totalEnrollments: 0, // TODO: add enrollment action
    totalRevenue: courses.reduce(
      (acc: number, c: { price?: number }) => acc + (c.price || 0),
      0
    ),
  };

  const recentUsers = users.slice(0, 5);
  const recentCourses = courses.slice(0, 5);

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--surface-container-low)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar title="Platform Overview" role="admin" />

        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  Admin Portal
                </p>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  Platform Overview
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
                  Monitor platform health and recent activity
                </p>
              </div>

              {/* System status badge */}
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--success, #22c55e)/10", color: "var(--success, #16a34a)" }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--success, #22c55e)" }}
                />
                System Healthy
              </div>
            </div>

            {/* Stats bento grid */}
            <StatsOverview stats={stats} />

            {/* Tables grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                  >
                    Recent Users
                  </h2>
                  <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    Last 5 joined
                  </span>
                </div>

                <div>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user: any, index: number) => (
                      <div
                        key={user.id}
                        className="px-5 py-3 flex items-center justify-between"
                        style={{
                          backgroundColor: index % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-variant)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                          >
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--on-surface)" }}
                            >
                              {user.name}
                            </p>
                            <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-xs capitalize"
                          style={{
                            backgroundColor: "var(--surface-container-high)",
                            color: "var(--on-surface-variant)",
                          }}
                        >
                          {user.role?.toLowerCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center" style={{ color: "var(--on-surface-variant)" }}>
                      No users found
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Courses */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                  >
                    Recent Courses
                  </h2>
                  <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    Last 5 created
                  </span>
                </div>

                <div>
                  {recentCourses.length > 0 ? (
                    recentCourses.map((course: any, index: number) => (
                      <div
                        key={course.id}
                        className="px-5 py-3 flex items-center justify-between"
                        style={{
                          backgroundColor: index % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-variant)",
                        }}
                      >
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--on-surface)" }}
                          >
                            {course.title}
                          </p>
                          <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                            {course.instructor?.name || "Unknown"}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: course.isPublished
                              ? "var(--primary-container)/15"
                              : "var(--surface-container-high)",
                            color: course.isPublished ? "var(--primary)" : "var(--on-surface-variant)",
                          }}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center" style={{ color: "var(--on-surface-variant)" }}>
                      No courses found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
