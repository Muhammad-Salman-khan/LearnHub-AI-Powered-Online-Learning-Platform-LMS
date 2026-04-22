"use client";

/**
 * CoursesTable — Scholarly Architect Design System
 *
 * White card table with tonal header.
 * Status badges: published (primary blue) / draft (muted).
 * No borders between rows — tonal alternation.
 * Uses CSS variables for dark mode support.
 */

import Link from "next/link";

interface Course {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft";
  students: number;
  thumbnail: string | null;
}

interface CoursesTableProps {
  courses: Course[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface-container-lowest)" }}>
      {/* Header row */}
      <div
        className="px-5 py-4 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide"
        style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}
      >
        <div className="col-span-5 md:col-span-4">Course</div>
        <div className="hidden md:block md:col-span-3">Category</div>
        <div className="col-span-3 md:col-span-2">Status</div>
        <div className="hidden md:block md:col-span-2 text-center">Students</div>
        <div className="col-span-4 md:col-span-1 text-right">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="px-5 py-4 grid grid-cols-12 gap-4 items-center"
            style={{
              backgroundColor: index % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-variant)",
            }}
          >
            {/* Course title + thumbnail placeholder */}
            <div className="col-span-5 md:col-span-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" }}
              >
                {course.title.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className="font-medium text-sm truncate"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  {course.title}
                </p>
                <p className="text-xs md:hidden" style={{ color: "var(--on-surface-variant)" }}>
                  {course.category}
                </p>
              </div>
            </div>

            {/* Category (hidden on mobile) */}
            <div className="hidden md:block md:col-span-3 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              {course.category}
            </div>

            {/* Status badge */}
            <div className="col-span-3 md:col-span-2">
              <span
                className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor:
                    course.status === "published"
                      ? "var(--primary-container)/15"
                      : "var(--surface-container-high)",
                  color: course.status === "published" ? "var(--primary)" : "var(--on-surface-variant)",
                }}
              >
                {course.status === "published" ? "Published" : "Draft"}
              </span>
            </div>

            {/* Students (hidden on mobile) */}
            <div
              className="hidden md:block md:col-span-2 text-center text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {course.students}
            </div>

            {/* Actions */}
            <div className="col-span-4 md:col-span-1 flex items-center justify-end gap-2">
              <Link
                href={`/dashboard/instructor/courses/${course.id}/edit`}
                className="p-2 rounded-sm transition-colors hover:bg-[var(--surface-container)]"
                style={{ color: "var(--primary)" }}
                aria-label="Edit"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </Link>

              <Link
                href={`/dashboard/instructor/courses/${course.id}/chapters/manage`}
                className="p-2 rounded-sm transition-colors hover:bg-[var(--surface-container)]"
                style={{ color: "var(--on-surface-variant)" }}
                aria-label="Chapters"
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
              </Link>

              <Link
                href={`/courses/${course.id}`}
                className="p-2 rounded-sm transition-colors hover:bg-[var(--surface-container)]"
                style={{ color: "var(--on-surface-variant)" }}
                aria-label="Preview"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
