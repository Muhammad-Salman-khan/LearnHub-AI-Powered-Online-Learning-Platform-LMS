"use client";

/**
 * InstructorCard — Scholarly Architect Design System
 *
 * Displays instructor info with avatar, name, title.
 * Uses CSS variables for dark mode support.
 */

interface InstructorCardProps {
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface-container-lowest)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "var(--primary)/20", color: "var(--primary)" }}>
          {instructor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>Instructor</h3>
          <p className="font-medium" style={{ color: "var(--primary)" }}>{instructor.name}</p>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>{instructor.title}</p>
        </div>
        <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: "var(--primary)" }}>
          <span className="material-symbols-outlined text-base">mail</span>
          Contact
        </button>
      </div>
    </div>
  );
}
