"use client";

/**
 * CourseCard (Dashboard) — Scholarly Architect Design System
 *
 * Used in the student dashboard for enrolled courses.
 * Card: surface-container-lowest on surface-container-low page.
 * Tonal layering: image placeholder → surface-container-high.
 * Progress bar: primary blue fill.
 * CTA button: primary sharp radius.
 * No amber, no glow, no gradients.
 * Uses CSS variables for dark mode support.
 *
 * Props unchanged — same interface for API compatibility.
 */

import Image from "next/image";
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

export default function CourseCard({ course, variant = "grid" }: CourseCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    if (course.lastChapterId) {
      router.push(`/courses/${course.id}/learn/${course.lastChapterId}`);
    } else {
      router.push(`/courses/${course.id}`);
    }
  };

  const buttonLabel =
    course.progress === 0
      ? "Start Course"
      : course.progress === 100
      ? "Review Course"
      : "Resume Course";

  return (
    <div
      className={`scholar-card rounded-lg overflow-hidden ${
        variant === "horizontal" ? "w-[280px] sm:w-[300px] flex-shrink-0" : "w-full"
      }`}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video w-full relative overflow-hidden group"
        style={{ backgroundColor: "var(--surface-container-high)" }}
      >
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Monogram placeholder — tonal, no gradient */
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "var(--surface-dim)" }}
          >
            <span
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
            >
              {course.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Category chip */}
        {course.category && (
          <span
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--surface-container-lowest)/92", color: "var(--primary)" }}
          >
            {course.category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3
          className="font-semibold text-sm line-clamp-2 mb-1"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          {course.title}
        </h3>
        <p className="text-xs truncate mb-4" style={{ color: "var(--on-surface-variant)" }}>
          {course.instructor}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--on-surface-variant)" }}>{course.progress}% complete</span>
            {course.progress === 100 && (
              <span
                className="font-medium"
                style={{ color: "var(--primary)" }}
              >
                Completed
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-9 text-xs font-medium rounded-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
          style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
