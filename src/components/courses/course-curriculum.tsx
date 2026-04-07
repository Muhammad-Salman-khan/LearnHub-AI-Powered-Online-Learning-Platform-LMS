"use client";

import { useState } from "react";

interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
  position: number;
  isFree: boolean;
  isPublished: boolean;
}

interface CourseCurriculumProps {
  chapters: Chapter[];
}

/**
 * CourseCurriculum - Expandable chapters list
 *
 * DESIGN.md Compliance:
 * - No-Line Rule: No borders between chapters, uses tonal shifts + spacing
 * - Amber Accent: Expand/collapse indicators
 * - Surface Hierarchy: Alternating backgrounds for chapters
 * - Card Hover: Tonal shift on chapter rows
 */
export function CourseCurriculum({ chapters }: CourseCurriculumProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    chapters[0]?.id || null,
  );

  return (
    <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] overflow-hidden">
      {/* Header - Uses spacing, not border */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-[#e2e2e2]">Course Curriculum</h2>
        <p className="text-sm text-[#8a8a8a] mt-1">
          {chapters.length} chapters
        </p>
      </div>

      {/* Chapters List - Uses spacing + tonal shifts, NOT divide-y borders */}
      <div className="space-y-1 p-2">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={`rounded-[min(var(--radius-md),4px)] overflow-hidden transition-all duration-300 ${
              index % 2 === 1 ? "bg-[#131313]/50" : ""
            }`}
          >
            {/* Chapter Header */}
            <button
              onClick={() =>
                setExpandedChapter(
                  expandedChapter === chapter.id ? null : chapter.id,
                )
              }
              className="w-full flex items-center justify-between p-4 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[#f97316] text-lg transition-transform duration-300"
                  style={{
                    transform:
                      expandedChapter === chapter.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-[#e2e2e2]">
                    Chapter {index + 1}: {chapter.title}
                  </h3>
                  <p className="text-xs text-[#8a8a8a] flex items-center gap-2">
                    {chapter.videoUrl && (
                      <span className="material-symbols-outlined text-xs">
                        play_circle
                      </span>
                    )}
                    {chapter.content && !chapter.videoUrl && (
                      <span className="material-symbols-outlined text-xs">
                        description
                      </span>
                    )}
                    {chapter.isFree && (
                      <span className="text-[#f97316]">Free Preview</span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#8a8a8a]">
                {chapter.videoUrl ? "Video" : "Reading"}
              </span>
            </button>

            {/* Chapter Details (Expandable) - Uses tonal shift, not border */}
            {expandedChapter === chapter.id && (
              <div className="bg-[#0e0e0e] p-4 pl-12 space-y-3">
                {chapter.description && (
                  <p className="text-sm text-[#e0c0b1]">
                    {chapter.description}
                  </p>
                )}
                {chapter.content && !chapter.videoUrl && (
                  <div className="text-sm text-[#e0c0b1] prose prose-invert prose-sm max-w-none">
                    {chapter.content}
                  </div>
                )}
                {chapter.videoUrl && (
                  <div className="flex items-center gap-3 text-sm text-[#e0c0b1]">
                    <span className="material-symbols-outlined text-[#f97316]">
                      play_circle
                    </span>
                    <span>Video lesson • ~15 min</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Amber Accent Line - slides in on hover (DESIGN.md card hover spec) */}
      <div className="h-0.5 bg-gradient-to-r from-[#f97316] to-transparent w-0 hover:w-full transition-all duration-300" />
    </div>
  );
}
