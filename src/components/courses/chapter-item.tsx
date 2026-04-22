"use client";

/**
 * ChapterItem — Scholarly Architect Design System
 *
 * Single lesson row in the chapter sidebar.
 * Active (current):  primary bg + on-primary text
 * Completed:         check_circle icon in primary blue
 * Locked:            muted, lock icon
 * No border on the item itself — tonal bg shift communicates state.
 */

interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    status: "completed" | "current" | "locked";
    duration?: string;
  };
  position: number;
  onClick?: () => void;
}

export function ChapterItem({ chapter, position, onClick }: ChapterItemProps) {
  const { status } = chapter;
  const isCurrent   = status === "current";
  const isCompleted = status === "completed";
  const isLocked    = status === "locked";

  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      onClick={isLocked ? undefined : onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-sm text-sm transition-all duration-150"
      style={{
        backgroundColor: isCurrent ? "var(--primary)" : "transparent",
        color: isCurrent ? "var(--on-primary)" : "var(--on-surface)",
        opacity: isLocked ? 0.45 : 1,
        cursor: isLocked ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isCurrent && !isLocked)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-container)";
      }}
      onMouseLeave={(e) => {
        if (!isCurrent)
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Status icon */}
      <span
        className="material-symbols-outlined text-base flex-shrink-0"
        style={{
          color: isCurrent
            ? "var(--on-primary)"
            : isCompleted
            ? "var(--primary)"
            : "var(--outline)",
        }}
      >
        {isCompleted ? "check_circle" : isCurrent ? "play_circle" : "lock"}
      </span>

      {/* Title + duration */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-mono flex-shrink-0"
            style={{ color: isCurrent ? "rgba(255,255,255,0.6)" : "var(--on-surface-variant)" }}
          >
            {String(position).padStart(2, "0")}
          </span>
          <span
            className="truncate font-medium text-sm"
            style={{ color: isCurrent ? "var(--on-primary)" : "var(--on-surface)" }}
          >
            {chapter.title}
          </span>
        </div>
        {chapter.duration && (
          <span
            className="text-[10px] flex items-center gap-0.5 mt-0.5"
            style={{ color: isCurrent ? "rgba(255,255,255,0.6)" : "var(--on-surface-variant)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>
              schedule
            </span>
            {chapter.duration}
          </span>
        )}
      </div>
    </div>
  );
}
