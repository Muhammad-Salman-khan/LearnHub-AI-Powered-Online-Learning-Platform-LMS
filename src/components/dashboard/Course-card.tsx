"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string | null;
  lastChapterId: string | null;
  category?: string;
}

interface CourseCardProps {
  course: Course;
  variant?: "horizontal" | "grid";
}

export default function CourseCard({
  course,
  variant = "grid",
}: CourseCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    if (course.lastChapterId) {
      router.push(`/courses/${course.id}/learn/${course.lastChapterId}`);
    } else {
      router.push(`/courses/${course.id}`);
    }
  };

  return (
    <Card
      className={`glass-card rounded-xl overflow-hidden transition-all w-full max-w-full ${
        variant === "horizontal"
          ? "w-[280px] sm:w-[300px] flex-shrink-0"
          : "w-full"
      }`}
    >
      {/* Thumbnail - 16:9 Aspect Ratio */}
      <div className="aspect-video w-full bg-[#1a1a1a] relative group overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center kinetic-gradient">
            <span className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg px-2 text-center break-words">
              {course.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Category Badge */}
        {course.category && (
          <Badge className="absolute top-2 left-2 bg-black/90 text-[#F97316] border-[#F97316]/30 hover:bg-black text-[10px] sm:text-xs">
            {course.category}
          </Badge>
        )}

        {/* Hover Overlay - Desktop Only */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden sm:flex">
          <Button
            size="sm"
            className="kinetic-gradient text-white border-0 hover:opacity-90"
          >
            {course.progress === 0 ? "Start" : "Continue"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 min-w-0">
        {/* Title - Truncated to 2 lines */}
        <h3 className="font-semibold text-gray-200 line-clamp-2 mb-1 group-hover:text-[#F97316] transition-colors min-w-0 break-words">
          {course.title}
        </h3>

        {/* Instructor - Truncated */}
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 truncate">
          {course.instructor}
        </p>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] sm:text-xs font-medium">
            <span className="text-gray-400">{course.progress}% Complete</span>
            <span
              className={
                course.progress === 100 ? "text-[#22c55e]" : "text-[#F97316]"
              }
            >
              {course.progress === 100 ? "✓ Completed" : `${course.progress}%`}
            </span>
          </div>

          {/* Progress Bar */}
          <Progress
            value={course.progress}
            className="h-1.5 sm:h-2 bg-[#1a1a1a] [&>div]:bg-gradient-to-r [&>div]:from-[#F97316] [&>div]:to-[#ffb690]"
          />
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="mt-3 sm:mt-4 w-full kinetic-gradient text-white border-0 hover:opacity-90 text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
        >
          {course.progress === 0
            ? "Start Course"
            : course.progress === 100
              ? "Review Course"
              : "Continue Learning"}
        </Button>
      </div>
    </Card>
  );
}
