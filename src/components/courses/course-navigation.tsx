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
    <div className="flex justify-between items-center pt-8 border-t border-border">
      {hasPrev && prevHref ? (
        <Link
          href={prevHref}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 text-muted-foreground opacity-30 cursor-not-allowed"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </button>
      )}

      {isCourseComplete && courseId ? (
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/student`}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
          >
            <span className="material-symbols-outlined">home</span>
            Return to Dashboard
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Browse More Courses
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : hasNext && nextHref ? (
        <Link
          href={nextHref}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Next
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 text-primary opacity-30 cursor-not-allowed font-medium"
        >
          Next
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
