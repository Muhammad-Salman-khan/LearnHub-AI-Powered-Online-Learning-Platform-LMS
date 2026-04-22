"use client";

/**
 * DiscussionPreview — Scholarly Architect Design System
 *
 * Preview of course discussion section.
 * Uses CSS variables for dark mode support.
 */

export function DiscussionPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2" style={{ color: "var(--on-surface)" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>forum</span>
          Discussion
        </h3>
        <button className="text-sm scholar-link">
          View All →
        </button>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface-container-lowest)", border: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm font-bold" style={{ backgroundColor: "var(--primary)/20" }}>
            Z
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>Zain Ahmed</p>
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>2 hours ago</span>
            </div>
            <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
              Great explanation on OKLCH! Can you share more about browser
              support?
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--on-surface-variant)" }}>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">
                  thumb_up
                </span>
                5
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">
                  reply
                </span>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
