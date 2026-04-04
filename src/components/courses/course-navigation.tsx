"use client";

interface CourseNavigationProps {
  hasPrev: boolean;
  hasNext: boolean;
}

export function CourseNavigation({ hasPrev, hasNext }: CourseNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-border">
      <button
        disabled={!hasPrev}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Previous
      </button>

      <button
        disabled={!hasNext}
        className="flex items-center gap-2 text-primary hover:text-primary/80 disabled:opacity-30 transition-colors font-medium"
      >
        Next
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}
