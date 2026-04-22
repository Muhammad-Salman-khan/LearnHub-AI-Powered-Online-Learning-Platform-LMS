"use client";

/**
 * CreateCourseBtn — Scholarly Architect Design System
 *
 * Primary CTA for instructor dashboard.
 * Sharp radius, primary blue, no glow.
 */

import { useRouter } from "next/navigation";

export function CreateCourseBtn() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard/instructor/courses/create")}
      className="inline-flex items-center gap-2 h-12 px-6 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
      style={{ backgroundColor: "#0040a1", color: "#ffffff" }}
    >
      <span className="material-symbols-outlined text-base">add_circle</span>
      Create New Course
    </button>
  );
}
