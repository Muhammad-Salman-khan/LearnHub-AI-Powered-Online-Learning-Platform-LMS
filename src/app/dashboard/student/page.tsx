/**
 * StudentDashboard — Scholarly Architect Design System
 *
 * Layout:
 *   Welcome section — name + study streak + "Browse" CTA
 *   3-col stat row   — Enrolled / Completed / In Progress (left-edge accent cards)
 *   Continue Learning — large featured card (2/5 image + 3/5 content)
 *   Your Courses grid — 4-col CourseCard grid
 *
 * Backend preserved exactly:
 *   getEnrolledCourses, getCourseProgress — no changes.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

import StatCard from "@/components/dashboard/Stat-card";
import CourseCard from "@/components/dashboard/Course-card";
import { getEnrolledCourses, getCourseProgress } from "@/server/action";

export default async function StudentDashboard() {
  /* ── Auth (backend unchanged) ────────────────────────────────────── */
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as any).id;

  /* ── Fetch enrolled courses + progress ───────────────────────────── */
  const enrolledRes = await getEnrolledCourses(userId, 1, 100);
  const rawCourses =
    enrolledRes.success && enrolledRes.data ? enrolledRes.data.items : [];

  const coursesWithProgress = await Promise.all(
    rawCourses.map(async (course: any) => {
      const progressRes = await getCourseProgress(userId, course.id);
      const p =
        progressRes.success && progressRes.data
          ? progressRes.data
          : { completed: 0, total: 0, percentage: 0, chapterIds: [] as string[] };
      // First chapter ID for navigation (or null if no chapters)
      const firstChapterId = (p.chapterIds && p.chapterIds.length > 0) ? p.chapterIds[0] : null;
      return {
        ...course,
        progress: p.percentage ?? 0,
        chaptersCompleted: p.completed ?? 0,
        chaptersTotal: p.total ?? 0,
        firstChapterId,
      };
    }),
  );

  /* ── Stats ───────────────────────────────────────────────────────── */
  const stats = {
    enrolled: coursesWithProgress.length,
    completed: coursesWithProgress.filter((c) => c.progress === 100).length,
    inProgress: coursesWithProgress.filter(
      (c) => c.progress > 0 && c.progress < 100,
    ).length,
  };

  const userName = session?.user?.name || "Student";

  /* Course to feature in "Continue Learning" hero card */
  const featuredCourse =
    coursesWithProgress.find((c) => c.progress > 0 && c.progress < 100) ??
    coursesWithProgress[0];

  return (
    <div className="space-y-8 max-w-full">

      {/* ════════════════════════════════════════════════════════════════
          WELCOME SECTION
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--primary)" }}
          >
            Student Dashboard
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Welcome back, {userName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
            Continue your learning journey
          </p>
        </div>

        {/* Browse CTA */}
        <Link
          href="/courses"
          className="flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
        >
          <span className="material-symbols-outlined text-base">menu_book</span>
          Browse All Courses
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STAT ROW — left-edge accent cards (Instructor design spec)
          ════════════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard label="Enrolled"    value={stats.enrolled}   icon={BookOpen}     color="primary" />
        <StatCard label="Completed"   value={stats.completed}  icon={CheckCircle}  color="primary" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock}        color="primary" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CONTINUE LEARNING — featured card
          2/5 image + 3/5 content (per student dashboard design)
          ════════════════════════════════════════════════════════════════ */}
      {featuredCourse && (
        <section>
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Continue Learning
          </h2>

          <div
            className="grid sm:grid-cols-5 rounded-lg overflow-hidden ambient-shadow"
            style={{ backgroundColor: "var(--surface-container-lowest)" }}
          >
            {/* Left: course thumbnail (2 cols) */}
            <div
              className="sm:col-span-2 aspect-video sm:aspect-auto relative"
              style={{ backgroundColor: "var(--surface-container-high)", minHeight: "180px" }}
            >
              {featuredCourse.thumbnail ? (
                <Image
                  src={featuredCourse.thumbnail}
                  alt={featuredCourse.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
                  >
                    {featuredCourse.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Right: course info (3 cols) */}
            <div className="sm:col-span-3 p-6 flex flex-col justify-between">
              <div>
                {featuredCourse.category && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{
                      backgroundColor: "var(--primary-container)/15",
                      color: "var(--primary)",
                    }}
                  >
                    {featuredCourse.category}
                  </span>
                )}

                <h3
                  className="text-xl font-bold mb-2 line-clamp-2"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  {featuredCourse.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--on-surface-variant)" }}>
                  {featuredCourse.instructor?.name ?? featuredCourse.instructor ?? "Unknown Instructor"}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--on-surface-variant)" }}>Your progress</span>
                    <span
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
                    >
                      {featuredCourse.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${featuredCourse.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {featuredCourse.firstChapterId ? (
                <Link
                  href={`/courses/${featuredCourse.id}/learn/${featuredCourse.firstChapterId}`}
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 w-fit"
                  style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Continue Learning
                </Link>
              ) : (
                <Link
                  href={`/courses/${featuredCourse.id}`}
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 w-fit"
                  style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  View Course
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          ALL ENROLLED COURSES — 4-col grid
          ════════════════════════════════════════════════════════════════ */}
      <section>
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          Your Courses
        </h2>

        {coursesWithProgress.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coursesWithProgress.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  instructor: course.instructor?.name ?? course.instructor ?? "Unknown",
                  lastChapterId: course.firstChapterId,
                }}
                variant="grid"
              />
            ))}
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
              school
            </span>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              No courses enrolled yet
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--on-surface-variant)" }}>
              Explore our catalog and start learning today
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-sm hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
