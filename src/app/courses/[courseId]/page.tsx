/**
 * CourseDetailPage — Scholarly Architect Design System
 *
 * Layout: 12-col grid
 *   8 cols — main content (about, learning outcomes, curriculum, instructor)
 *   4 cols — sticky enrollment sidebar (CourseSidebar)
 *
 * Page background: surface-container-low
 * Header: CourseHeader component (has its own surface-container-low bg)
 *
 * Backend preserved exactly:
 *   getCourseById, getEnrolledCourses, getCourseProgress — no changes.
 */

import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { CourseHeader } from "@/components/courses/course-header";
import { CourseSidebar } from "@/components/courses/course-sidebar";
import { CourseCurriculum } from "@/components/courses/course-curriculum";
import { CourseTabs } from "@/components/courses/course-tabs";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";
import Image from "next/image";
import { getCourseById, getEnrolledCourses, getCourseProgress } from "@/server/action";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const raw = await getCourseById(courseId);
  const course = raw.data;
  if (!course) return { title: "Course Not Found | LearnHub" };
  return {
    title: `${course.title} | LearnHub`,
    description: course.description,
  };
}

/* What You'll Learn — static copy enriched by course context */
const LEARNING_OUTCOMES = [
  "Master core concepts",
  "Build real-world projects",
  "Industry best practices",
  "Portfolio-ready skills",
];

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  /* ── Data fetching (backend unchanged) ───────────────────────────── */
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  const courseRaw = await getCourseById(courseId);
  const course = courseRaw.data;
  if (!course) notFound();

  let isEnrolled = false;
  let userProgress = 0;

  if (userId) {
    const enrolledRes = await getEnrolledCourses(userId, 1, 100);
    const enrolledCourses =
      enrolledRes.success && enrolledRes.data ? enrolledRes.data.items : [];
    isEnrolled = enrolledCourses.some((c: any) => c.id === courseId);

    if (isEnrolled) {
      const progressRes = await getCourseProgress(userId, courseId);
      userProgress =
        progressRes.success && progressRes.data
          ? progressRes.data.percentage
          : 0;
    }
  }

  const totalChapters = course.chapters.length;
  /* Estimate duration: 15 min per video chapter, 5 min per reading */
  const totalDuration = course.chapters.reduce(
    (acc, ch) => acc + (ch.videoUrl ? 15 : 5),
    0,
  );

  return (
    <main style={{ backgroundColor: "var(--surface-container-low)", minHeight: "100vh" }}>

      {/* Theme toggle - positioned absolute */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ── Course hero header ──────────────────────────────────────── */}
      <CourseHeader course={course} />

      {/* ── Main content + sidebar ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">

          {/* ════════════════════════════════════════════════════════════
              MAIN COLUMN (8 cols)
              ════════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-8 space-y-8">

            {/* About this course */}
            <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
              >
                About this course
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                {course.description}
              </p>
            </div>

            {/* What You'll Learn — left-edge accent per design spec */}
            <div
              className="rounded-lg p-6 sm:p-8"
              style={{ backgroundColor: "var(--surface-container-lowest)" }}
            >
              <h2
                className="text-xl font-bold mb-5"
                style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
              >
                What you&apos;ll learn
              </h2>

              {/*
               * Left-edge accent line on the list wrapper —
               * "2px left-edge accent line" per design spec for highlighted content.
               */}
              <div
                className="pl-4"
                style={{ borderLeft: "2px solid var(--primary)" }}
              >
                <ul className="grid sm:grid-cols-2 gap-3">
                  {LEARNING_OUTCOMES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined fill-icon text-lg flex-shrink-0 mt-0.5"
                        style={{ color: "var(--primary)" }}
                      >
                        check_circle
                      </span>
                      <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course curriculum */}
            <CourseCurriculum chapters={course.chapters} courseId={courseId} />

            {/* Instructor section */}
            <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
              >
                Your instructor
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "var(--surface-container-high)" }}
                >
                  {course.instructor.image ? (
                    <Image
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      person
                    </span>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <h3
                    className="text-lg font-semibold mb-0.5"
                    style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                  >
                    {course.instructor.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: "var(--primary)" }}>
                    Senior Engineer &amp; Educator
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                    {(course.instructor as any).bio ??
                      "Industry veteran with 10+ years of experience building scalable systems and mentoring the next generation of engineers."}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs: Overview / Reviews / Q&A */}
            <CourseTabs course={course} enrolled={isEnrolled} />
          </section>


          {/* ════════════════════════════════════════════════════════════
              SIDEBAR (4 cols, sticky)
              ════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4">
            <CourseSidebar
              course={course}
              enrolled={isEnrolled}
              progress={userProgress}
              totalChapters={totalChapters}
              totalDuration={totalDuration}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
