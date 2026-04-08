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
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  void params;
  const { course, chapter, chapters } = mockData;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Mobile Header - Uses tonal shift, NOT border */}
      <div className="md:hidden p-4 flex items-center justify-between bg-[#131313]/95 backdrop-blur-[16px] sticky top-0 z-50">
        <h1 className="font-bold truncate flex-1 text-[#e2e2e2]">
          {course.title}
        </h1>

        {/* Mobile Chapter List Drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#e2e2e2] hover:bg-[#584237]/10 hover:text-[#f97316] transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 bg-[#131313] border-l border-[#584237]/15"
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-24">
            {/* Breadcrumb Navigation - Uses spacing, not border */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-[#8a8a8a]">
              <span className="hover:text-[#f97316] cursor-pointer transition-colors">
                My Courses
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="hover:text-[#f97316] cursor-pointer transition-colors truncate max-w-[200px]">
                {course.title}
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-[#f97316] font-medium truncate max-w-[200px]">
                {chapter.title}
              </span>
            </nav>

            {/* Spec: Video Embed 16:9 - Professional roundedness + Amber Radiance */}
            <div className="w-full aspect-video rounded-[min(var(--radius-md),4px)] overflow-hidden bg-[#0e0e0e] shadow-[0_0_40px_rgba(249,115,22,0.08)] transition-all duration-500">
              <VideoPlayer url={chapter.videoUrl} />
            </div>

            {/* Chapter Header */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#e2e2e2] tracking-tight mb-3 leading-tight">
                    {chapter.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-[#8a8a8a]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-[#f97316]">
                        schedule
                      </span>
                      {chapter.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-[#f97316]">
                        folder
                      </span>
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Spec: Mark Complete Button - Gradient Primary */}
                <div className="hidden md:block">
                  <MarkCompleteButton isCompleted={chapter.isCompleted} />
                </div>
              </div>

              {/* Spec: Description - Editorial body text */}
              <p className="text-[#e0c0b1] text-lg leading-relaxed max-w-3xl">
                {chapter.description}
              </p>

              {/* Mobile Mark Complete Button */}
              <div className="md:hidden">
                <MarkCompleteButton isCompleted={chapter.isCompleted} />
              </div>
            </div>

            {/* Instructor Card - Uses surface hierarchy */}
            <InstructorCard instructor={course.instructor} />

            {/* Resources Section - No dividers, uses spacing */}
            <ResourcesSection resources={chapter.resources} />

            {/* Discussion Preview */}
            <DiscussionPreview />

            {/* Spec: Prev/Next Navigation - Editorial spacing */}
            <div className="pt-12 sm:pt-24">
              <CourseNavigation hasPrev={true} hasNext={true} />
            </div>
          </div>
        </div>

        {/* --- RIGHT: Chapter Sidebar (Fixed 280px - Desktop Only) */}
        {/* Uses tonal shift instead of border-l */}
        <div className="w-[280px] hidden md:flex flex-col bg-[#1b1b1b]">
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
