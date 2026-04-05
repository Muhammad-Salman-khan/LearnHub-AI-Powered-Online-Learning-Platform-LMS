"use client";

import { CreateCourseBtn } from "./create-course-btn";

export function EmptyState() {
  return (
    <div className="glass-card-no-glow rounded-xl border border-border p-12 text-center space-y-4">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary">
          inbox
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">No Courses Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          You haven't created any courses yet. Start building your first course
          to begin earning.
        </p>
      </div>
      <div className="pt-4">
        <CreateCourseBtn />
      </div>
    </div>
  );
}
