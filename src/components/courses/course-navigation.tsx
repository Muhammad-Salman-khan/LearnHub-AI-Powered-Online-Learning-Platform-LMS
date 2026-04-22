"use client";

import Link from "next/link";

interface CourseNavigationProps {
  hasPrev: boolean;
  hasNext: boolean;
  prevHref?: string;
  nextHref?: string;
  isCourseComplete?: boolean;
  courseId?: string;
}

export function CourseNavigation({ hasPrev, hasNext, prevHref, nextHref, isCourseComplete, courseId }: CourseNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-8" style={{ borderTop: "1px solid var(--border)" }}>
      {hasPrev && prevHref ? (
        <Link
          href={prevHref}
          className="flex items-center gap-2 transition-colors"
          style={{ color: "var(--on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 opacity-30 cursor-not-allowed"
          style={{ color: "var(--on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </button>
      )}

      {isCourseComplete && courseId ? (
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/student`}
            className="flex items-center gap-2 transition-colors font-medium"
            style={{ color: "var(--success, #22c55e)" }}
          >
            <span className="material-symbols-outlined">home</span>
            Return to Dashboard
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 transition-colors font-medium"
            style={{ color: "var(--primary)" }}
          >
            Browse More Courses
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : hasNext && nextHref ? (
        <Link
          href={nextHref}
          className="flex items-center gap-2 transition-colors font-medium"
          style={{ color: "var(--primary)" }}
        >
          Next
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 opacity-30 cursor-not-allowed font-medium"
          style={{ color: "var(--primary)" }}
        >
          Next
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
