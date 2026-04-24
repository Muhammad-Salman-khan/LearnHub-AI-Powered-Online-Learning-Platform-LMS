/**
 * LessonPlayerPage — Scholarly Architect Design System
 *
 * Layout:
 *   Fixed top nav bar  — back button + course title + mark-complete CTA
 *   Left main area     — video player (dark bg) + lesson content tabs
 *   Right sidebar      — ChapterSidebar (fixed 280px, white)
 *
 * Page bg: surface-variant
 * All text content panels (description, content) stay on surface-container-lowest.
 *
 * Backend preserved exactly:
 *   getCourseById, getCourseProgress, getChapterProgress — unchanged.
 */

import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseById, getCourseProgress, getEnrolledCourses } from "@/server/action";
import { VideoPlayer } from "@/components/courses/video-player";
import { ChapterSidebar } from "@/components/courses/chapter-sidebar";
import { MarkCompleteButton } from "@/components/courses/mark-complete-button";
import { CourseNavigation } from "@/components/courses/course-navigation";
import { InstructorCard } from "@/components/courses/instructor-card";
import { ResourcesSection } from "@/components/courses/resources-section";
import { DiscussionPreview } from "@/components/courses/discussion-preview";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";
import AIAssistant from "@/components/courses/ai-assistant";
import Link from "next/link";

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  /* ── Data fetching (backend unchanged) ───────────────────────────── */
  const { courseId, chapterId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  /* ── Enrollment check ──────────────────────────────────────────── */
  if (!userId) {
    // Not logged in - redirect to login with callback
    redirect(`/login?callbackUrl=/courses/${courseId}/learn/${chapterId}`);
  }

  // Check if enrolled
  const enrolledRes = await getEnrolledCourses(userId, 1, 100);
  const enrolledCourses =
    enrolledRes.success && enrolledRes.data ? enrolledRes.data.items : [];
  const isEnrolled = enrolledCourses.some((c: any) => c.id === courseId);

  if (!isEnrolled) {
    // Not enrolled - redirect to course detail page
    redirect(`/courses/${courseId}`);
  }

  const courseRes = await getCourseById(courseId);
  if (!courseRes?.success || !courseRes.data) return notFound();

  const course = courseRes.data;
  const chapters =
    course.chapters?.filter((ch: { isPublished: boolean }) => ch.isPublished) || [];
  const chapter = chapters.find((ch: { id: string }) => ch.id === chapterId);
  if (!chapter) return notFound();

  const currentIndex = chapters.findIndex((ch: { id: string }) => ch.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  /* Real progress from DB */
  let progressData = { completed: 0, total: chapters.length, percentage: 0 };
  if (userId) {
    const progressRes = await getCourseProgress(userId, courseId);
    if (progressRes.success && progressRes.data) {
      progressData = {
        completed: progressRes.data.completed,
        total: progressRes.data.total,
        percentage: progressRes.data.percentage,
      };
    }
  }

  const isCourseComplete = progressData.percentage === 100;

  /* Format chapters for sidebar */
  const formattedChapters = chapters.map(
    (ch: { id: string; title: string }, i: number) => ({
      id: ch.id,
      title: ch.title,
      status:
        i < currentIndex
          ? ("completed" as const)
          : i === currentIndex
          ? ("current" as const)
          : ("locked" as const),
      duration: "~15 min",
    }),
  );

  /* Build resources list */
  const resources: { name: string; type: string; url: string }[] = [];
  if (chapter.videoUrl)
    resources.push({ name: "Video Source", type: "Link", url: chapter.videoUrl });
  if (chapter.content)
    resources.push({ name: "Chapter Notes", type: "Document", url: "#" });

  return (
    /*
     * Full-height layout. Video player uses dark bg.
     * Content areas use surface-container-lowest per Scholarly Architect.
     */
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--surface-variant)" }}>

      {/* ════════════════════════════════════════════════════════════════
          FIXED TOP NAV BAR
          Surface bg, back button + title + mark-complete CTA + theme toggle.
          ════════════════════════════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-40 flex items-center gap-4 px-5 py-3"
        style={{ backgroundColor: "var(--surface-variant)" }}
      >
        {/* Back to course */}
        <Link
          href={`/courses/${courseId}`}
          className="flex items-center gap-1.5 text-sm flex-shrink-0"
          style={{ color: "var(--on-surface-variant)" }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="hidden sm:inline">Back to course</span>
        </Link>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 text-sm">
          <Link
            href="/courses"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Courses
          </Link>
          <span className="material-symbols-outlined text-xs" style={{ color: "var(--outline)" }}>
            chevron_right
          </span>
          <Link
            href={`/courses/${courseId}`}
            className="truncate max-w-[200px] hover:opacity-70 transition-opacity"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {course.title}
          </Link>
          <span className="material-symbols-outlined text-xs" style={{ color: "var(--outline)" }}>
            chevron_right
          </span>
          <span
            className="font-medium truncate max-w-[200px]"
            style={{ color: "var(--primary)" }}
          >
            {chapter.title}
          </span>
        </div>

        {/* Mobile: course title */}
        <h1
          className="md:hidden font-bold truncate flex-1 text-sm"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          {course.title}
        </h1>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Mark complete — right side */}
        <div className="flex-shrink-0">
          <MarkCompleteButton chapterId={chapter.id} />
        </div>
      </nav>


      {/* ════════════════════════════════════════════════════════════════
          BODY — main scroll area + chapter sidebar
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: main scrollable content ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--surface-variant)" }}>

          {/* Video player — constrained height */}
          <div
            className="w-full"
            style={{ backgroundColor: "#0f0f11", maxHeight: "60vh" }}
          >
            <div className="w-full h-full aspect-video max-h-[60vh] mx-auto">
              <VideoPlayer
                url={chapter.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              />
            </div>
          </div>

          {/* Lesson content panels — surface container lowest */}
          <div
            className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8"
            style={{ backgroundColor: "var(--surface-variant)" }}
          >
            {/* Lesson header */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
                style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
              >
                {chapter.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--primary)" }}>
                    menu_book
                  </span>
                  {chapters.length} chapters total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--primary)" }}>
                    trending_up
                  </span>
                  {progressData.percentage}% complete
                </span>
              </div>
            </div>

            {/* Description */}
            {chapter.description && (
              <div
                className="rounded-lg p-6 ambient-shadow"
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  Description
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  {chapter.description}
                </p>
              </div>
            )}

            {/* Content / Transcript */}
            {chapter.content && (
              <div className="rounded-lg p-6" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  Content
                </h2>
                <p
                  className="text-base leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {chapter.content}
                </p>
              </div>
            )}

            {/* Instructor card */}
            {course.instructor && (
              <InstructorCard
                instructor={{
                  name: course.instructor.name || "Unknown",
                  avatar: course.instructor.image || "",
                  title: (course.instructor as any).bio || "Instructor",
                }}
              />
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <ResourcesSection resources={resources} />
            )}

            {/* Discussion preview */}
            <DiscussionPreview />

            {/* Prev / Next navigation */}
            <div className="pt-4">
              <CourseNavigation
                hasPrev={!!prevChapter}
                hasNext={!!nextChapter}
                prevHref={prevChapter ? `/courses/${courseId}/learn/${prevChapter.id}` : "#"}
                nextHref={nextChapter ? `/courses/${courseId}/learn/${nextChapter.id}` : "#"}
                isCourseComplete={isCourseComplete}
                courseId={courseId}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: chapter sidebar (280px, desktop only) ──────────────── */}
        <div
          className="hidden md:flex flex-col w-[280px] flex-shrink-0"
          style={{ backgroundColor: "var(--surface-container-lowest)", borderLeft: "1px solid var(--outline-variant)" }}
        >
          <ChapterSidebar
            courseTitle={course.title}
            progress={progressData.percentage}
            chapters={formattedChapters}
          />
        </div>
      </div>

      {/* AI Study Assistant (floating, only when logged in) */}
      {session && (
        <AIAssistant
          chapter={{
            title: chapter.title,
            description: chapter.description,
            content: chapter.content,
          }}
        />
      )}
    </div>
  );
}
