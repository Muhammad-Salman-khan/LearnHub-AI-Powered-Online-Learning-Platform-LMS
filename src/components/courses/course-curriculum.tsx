"use client";

/**
 * CourseCurriculum — Scholarly Architect Design System
 *
 * Expandable curriculum accordion.
 * No-Line / No-Divider rules: spacing + background tonal shifts only.
 * Chapter numbers are large editorial numerals (Manrope) per design.
 * Active (expanded) chapter: surface-container-low inset.
 * Free preview chip: primary blue tonal pill.
 */

import { useState } from "react";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  position: number;
  isFree: boolean;
  isPublished: boolean;
}

interface CourseCurriculumProps {
  chapters: Chapter[];
  courseId: string;
}

export function CourseCurriculum({ chapters, courseId }: CourseCurriculumProps) {
  const [expanded, setExpanded] = useState<string | null>(chapters[0]?.id ?? null);

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface-container-lowest)" }}>

      {/* Header */}
      <div className="px-6 py-5" style={{ backgroundColor: "var(--surface-container-low)" }}>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          Course Curriculum
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
          {chapters.length} chapters
        </p>
      </div>

      {/* Chapter accordion — no divider lines; spacing + tonal alternation */}
      <div className="p-4 space-y-2">
        {chapters.map((chapter, index) => {
          const isOpen = expanded === chapter.id;

          return (
            <div
              key={chapter.id}
              className="rounded-sm overflow-hidden transition-colors duration-200"
              style={{
                backgroundColor: index % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-variant)",
              }}
            >
              {/* Chapter toggle button */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : chapter.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-150"
                style={{
                  backgroundColor: isOpen ? "var(--surface-container-low)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-container)";
                }}
                onMouseLeave={(e) => {
                  if (!isOpen)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {/* Large chapter number — editorial Manrope */}
                <span
                  className="text-3xl font-extrabold leading-none w-10 flex-shrink-0 select-none"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: isOpen ? "var(--primary)" : "var(--primary-fixed-dim)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {chapter.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                      {chapter.videoUrl ? "Video" : "Reading"} · ~15 min
                    </span>
                    {chapter.isFree && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "var(--primary-container)",
                          color: "var(--on-primary-container)",
                        }}
                      >
                        Free Preview
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className="material-symbols-outlined text-lg flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: "var(--on-surface-variant)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>

              {/* Expanded content — surface-container-low inset */}
              {isOpen && (
                <div
                  className="px-5 pb-5 pt-2 ml-14"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  {chapter.description && (
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                      {chapter.description}
                    </p>
                  )}
                  {chapter.content && !chapter.videoUrl && (
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                      {chapter.content}
                    </p>
                  )}

                  {/* Start lesson link */}
                  <Link
                    href={`/courses/${courseId}/learn/${chapter.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium scholar-link"
                  >
                    Start lesson
                    <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
