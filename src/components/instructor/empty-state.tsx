import { CreateCourseBtn } from "./create-course-btn";

/**
 * EmptyState — Scholarly Architect Design System
 *
 * White card on tonal background. Primary blue icon.
 * No borders, no glassmorphism.
 */

export function EmptyState() {
  return (
    <div
      className="rounded-lg p-12 text-center space-y-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 64, 161, 0.08)" }}
      >
        <span
          className="material-symbols-outlined text-4xl"
          style={{ color: "#0040a1" }}
        >
          inbox
        </span>
      </div>

      <div className="space-y-2">
        <h3
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
        >
          No Courses Yet
        </h3>
        <p
          className="max-w-md mx-auto text-sm"
          style={{ color: "#424654" }}
        >
          You haven&apos;t created any courses yet. Start building your first course
          to begin earning.
        </p>
      </div>

      <div className="pt-4">
        <CreateCourseBtn />
      </div>
    </div>
  );
}
