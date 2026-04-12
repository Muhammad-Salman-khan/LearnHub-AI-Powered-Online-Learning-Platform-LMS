import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseById, getCourseProgress, getChapterProgress } from "@/server/action";
import { VideoPlayer } from "@/components/courses/video-player";
import { ChapterSidebar } from "@/components/courses/chapter-sidebar";
import { MarkCompleteButton } from "@/components/courses/mark-complete-button";
import { CourseNavigation } from "@/components/courses/course-navigation";
import { InstructorCard } from "@/components/courses/instructor-card";
import { ResourcesSection } from "@/components/courses/resources-section";
import { DiscussionPreview } from "@/components/courses/discussion-preview";
import Link from "next/link";

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  const courseRes = await getCourseById(courseId);
  if (!courseRes?.success || !courseRes.data) return notFound();

  const course = courseRes.data;
  const chapters = course.chapters?.filter((ch: { isPublished: boolean }) => ch.isPublished) || [];
  const chapter = chapters.find((ch: { id: string }) => ch.id === chapterId);

  if (!chapter) return notFound();

  const currentIndex = chapters.findIndex((ch: { id: string }) => ch.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Get REAL progress from database
  let progressData = { completed: 0, total: chapters.length, percentage: 0 };
  if (userId) {
    const progressRes = await getCourseProgress(userId, courseId);
    if (progressRes.success) {
      progressData = progressRes.data;
    }
  }

  const isCourseComplete = progressData.percentage === 100;

  const formattedChapters = chapters.map((ch: { id: string; title: string }, i: number) => ({
    id: ch.id,
    title: ch.title,
    status: i < currentIndex ? ("completed" as const) : i === currentIndex ? ("current" as const) : ("locked" as const),
    duration: "~15 min",
  }));

  // Resources
  const resources: { name: string; type: string; url: string }[] = [];
  if (chapter.videoUrl) resources.push({ name: "Video Source", type: "Link", url: chapter.videoUrl });
  if (chapter.content) resources.push({ name: "Chapter Notes", type: "Document", url: "#" });

  return (
    <div className="flex flex-col h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Mobile Header */}
      <div className="md:hidden p-4 flex items-center justify-between bg-[#131313]/95 backdrop-blur-[16px] sticky top-0 z-50">
        <h1 className="font-bold truncate flex-1 text-[#e2e2e2]">
          {course.title}
        </h1>
        <Link href={`/courses/${courseId}`} className="text-[#f97316] hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT: Main Content (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto">
          {/* Added pt-24 for navbar spacing */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pt-28 space-y-8 sm:space-y-12">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-[#8a8a8a]">
              <Link href="/courses" className="hover:text-[#f97316] cursor-pointer transition-colors">
                Courses
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <Link href={`/courses/${courseId}`} className="hover:text-[#f97316] cursor-pointer transition-colors truncate max-w-[200px]">
                {course.title}
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#f97316] font-medium truncate max-w-[200px]">
                {chapter.title}
              </span>
            </nav>

            {/* Video Player */}
            <div className="w-full aspect-video rounded-[min(var(--radius-md),4px)] overflow-hidden bg-[#0e0e0e] shadow-[0_0_40px_rgba(249,115,22,0.08)] transition-all duration-500">
              <VideoPlayer url={chapter.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} />
            </div>

            {/* Chapter Header with Title, Description, and Content */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#e2e2e2] tracking-tight mb-3 leading-tight">
                    {chapter.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-[#8a8a8a]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-[#f97316]">schedule</span>
                      {chapters.length} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-[#f97316]">trending_up</span>
                      {progressData.percentage}% complete
                    </span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <MarkCompleteButton chapterId={chapter.id} />
                </div>
              </div>

              {/* Chapter Description */}
              {chapter.description && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#e2e2e2]">Description</h2>
                  <p className="text-[#e0c0b1] text-base leading-relaxed max-w-3xl">
                    {chapter.description}
                  </p>
                </div>
              )}

              {/* Chapter Content */}
              {chapter.content && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#e2e2e2]">Content</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[#e0c0b1] text-base leading-relaxed whitespace-pre-wrap">
                      {chapter.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Mark Complete */}
              <div className="md:hidden">
                <MarkCompleteButton chapterId={chapter.id} />
              </div>
            </div>

            {/* Instructor Card */}
            {course.instructor && (
              <InstructorCard
                instructor={{
                  name: course.instructor.name || "Unknown",
                  avatar: course.instructor.image || "",
                  title: course.instructor.bio || "Instructor",
                }}
              />
            )}

            {/* Resources */}
            {resources.length > 0 && <ResourcesSection resources={resources} />}

            {/* Discussion Preview */}
            <DiscussionPreview />

            {/* Prev/Next Navigation */}
            <div className="pt-8 sm:pt-12">
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

        {/* --- RIGHT: Chapter Sidebar (Fixed 280px - Desktop Only) --- */}
        <div className="w-[280px] hidden md:flex flex-col bg-[#1b1b1b]">
          <ChapterSidebar
            courseTitle={course.title}
            progress={progressData.percentage}
            chapters={formattedChapters}
          />
        </div>
      </div>
    </div>
  );
}
