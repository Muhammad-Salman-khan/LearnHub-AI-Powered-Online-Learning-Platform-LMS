"use client";

import { useState } from "react";
import { VideoPlayer } from "@/components/courses/video-player";
import { ChapterSidebar } from "@/components/courses/chapter-sidebar";
import { MarkCompleteButton } from "@/components/courses/mark-complete-button";
import { CourseNavigation } from "@/components/courses/course-navigation";
import { InstructorCard } from "@/components/courses/instructor-card";
import { ResourcesSection } from "@/components/courses/resources-section";
import { DiscussionPreview } from "@/components/courses/discussion-preview";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ⚠️ MOCK DATA (Replace with real DB data later)
const mockData = {
  course: {
    title: "Advanced UI Design Systems",
    progress: 45,
    category: "Design",
    instructor: {
      name: "Sarah Ahmed",
      avatar: "/avatars/sarah.jpg",
      title: "Senior Product Designer",
    },
  },
  chapter: {
    title: "Color Theory & Accessibility",
    description:
      "Learn how to build accessible color palettes using OKLCH values. We'll cover contrast ratios, color blindness simulation, and practical implementation in Tailwind CSS.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isCompleted: false,
    duration: "12:45",
    resources: [
      { name: "Color Contrast Checker", type: "Tool", url: "#" },
      { name: "OKLCH Color Picker", type: "Tool", url: "#" },
      { name: "Chapter Slides (PDF)", type: "Download", url: "#" },
    ],
  },
  chapters: [
    {
      id: "1",
      title: "Intro to Design Tokens",
      status: "completed" as const,
      duration: "5:20",
    },
    {
      id: "2",
      title: "Color Theory & Accessibility",
      status: "current" as const,
      duration: "12:45",
    },
    {
      id: "3",
      title: "Typography Scale",
      status: "locked" as const,
      duration: "8:10",
    },
  ],
};

export default function LessonPlayerPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { course, chapter, chapters } = mockData;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <h1 className="font-bold truncate flex-1">{course.title}</h1>

        {/* Mobile Chapter List Drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-muted/50"
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 bg-background border-l border-border"
          >
            <ChapterSidebar
              courseTitle={course.title}
              progress={course.progress}
              chapters={chapters}
              onClose={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT: Main Content (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
            {/* Breadcrumb Navigation */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-pointer transition-colors">
                My Courses
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors truncate max-w-[200px]">
                {course.title}
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-primary font-medium truncate max-w-[200px]">
                {chapter.title}
              </span>
            </nav>

            {/* Spec: Video Embed 16:9 */}
            <div className="w-full aspect-video rounded-xl overflow-hidden glass-card-no-glow amber-glow transition-all duration-500">
              <VideoPlayer url={chapter.videoUrl} />
            </div>

            {/* Chapter Header */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {chapter.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        schedule
                      </span>
                      {chapter.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        folder
                      </span>
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Spec: Mark Complete Button */}
                <div className="hidden md:block">
                  <MarkCompleteButton isCompleted={chapter.isCompleted} />
                </div>
              </div>

              {/* Spec: Description */}
              <p className="text-muted-foreground text-lg leading-relaxed">
                {chapter.description}
              </p>

              {/* Mobile Mark Complete Button */}
              <div className="md:hidden">
                <MarkCompleteButton isCompleted={chapter.isCompleted} />
              </div>
            </div>

            {/* Instructor Card */}
            <InstructorCard instructor={course.instructor} />

            {/* Resources Section */}
            <ResourcesSection resources={chapter.resources} />

            {/* Discussion Preview */}
            <DiscussionPreview />

            {/* Spec: Prev/Next Navigation */}
            <CourseNavigation hasPrev={true} hasNext={true} />
          </div>
        </div>

        {/* --- RIGHT: Chapter Sidebar (Fixed 280px - Desktop Only) --- */}
        <div className="w-[280px] border-l border-border hidden md:flex flex-col bg-background">
          <ChapterSidebar
            courseTitle={course.title}
            progress={course.progress}
            chapters={chapters}
          />
        </div>
      </div>
    </div>
  );
}
