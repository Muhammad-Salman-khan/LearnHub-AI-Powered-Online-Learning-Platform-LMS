"use client";

/**
 * ChapterSidebar — Scholarly Architect Design System
 *
 * Fixed right panel in the lesson player.
 * Background: surface-container-lowest — pops against page bg.
 * Header: surface-container-low tonal separation (No-Line Rule).
 * Active lesson: primary background, on-primary text.
 * Progress bar: primary blue fill.
 */

import { ChapterItem } from "./chapter-item";

interface ChapterSidebarProps {
  courseTitle: string;
  progress: number;
  chapters: any[];
  onClose?: () => void;
}

export function ChapterSidebar({
  courseTitle,
  progress,
  chapters,
  onClose,
}: ChapterSidebarProps) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--surface-container-lowest)" }}>

      {/* ── Sticky header — surface-container-low bg (tonal separation) ── */}
      <div
        className="sticky top-0 z-10 px-5 py-4"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2
            className="font-bold text-sm truncate leading-tight flex-1 pr-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            {courseTitle}
          </h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden flex-shrink-0"
              aria-label="Close sidebar"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: "var(--on-surface-variant)" }}>Progress</span>
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
          >
            {progress}%
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Scrollable chapter list ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-0.5">
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            position={index + 1}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  );
}
