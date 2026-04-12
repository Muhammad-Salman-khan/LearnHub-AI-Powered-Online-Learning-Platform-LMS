"use client";

import Link from "next/link";
import Image from "next/image";
import EnrollButtonWrapper from "@/app/courses/[courseId]/_components/EnrollButtonWrapper";

interface CourseSidebarProps {
  course: {
    id: string;
    price: number;
    title: string;
    thumbnail?: string | null;
  };
  enrolled: boolean;
  progress: number;
  totalChapters: number;
  totalDuration: number;
}

export function CourseSidebar({
  course,
  enrolled,
  progress,
  totalChapters,
  totalDuration,
}: CourseSidebarProps) {

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `Rs. ${price.toLocaleString()}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="lg:sticky lg:top-8">
      {/* ✅ Card with hover effect: tonal shift + amber accent line */}
      <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.08)] transition-all duration-300 hover:bg-[#2a2a2a] group">
        {/* Thumbnail (Mobile) */}
        <div className="relative aspect-video lg:hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 1024px) 100vw"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0e0e0e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#5a5a5a] text-3xl">
                school
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price */}
          <div className="text-center">
            <p className="text-3xl font-bold text-[#f97316]">
              {formatPrice(course.price)}
            </p>
            {course.price > 0 && (
              <p className="text-xs text-[#8a8a8a] mt-1">One-time payment</p>
            )}
          </div>

          {/* Enroll / Continue Button */}
          {enrolled ? (
            <Link
              href={`/courses/${course.id}/learn`}
              className="block w-full h-12 bg-gradient-to-br from-[#ffb690] to-[#f97316] text-[#131313] font-semibold text-center rounded-[min(var(--radius-md),4px)] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.08)]"
            >
              Continue Learning
            </Link>
          ) : (
            <EnrollButtonWrapper courseId={course.id} price={course.price} />
          )}

          {/* Progress Bar (if enrolled) */}
          {enrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8a8a8a]">Your Progress</span>
                <span className="text-[#f97316] font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-[#0e0e0e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffb690] to-[#f97316] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* ✅ Course Stats - NO border-t, uses spacing instead */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[#f97316] text-lg">
                menu_book
              </span>
              <span className="text-[#e0c0b1]">{totalChapters} chapters</span>{" "}
              {/* ✅ chapters, not lessons */}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[#f97316] text-lg">
                schedule
              </span>
              <span className="text-[#e0c0b1]">
                {formatDuration(totalDuration)} total
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[#f97316] text-lg">
                workspace_premium
              </span>
              <span className="text-[#e0c0b1]">Certificate of completion</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[#f97316] text-lg">
                download
              </span>
              <span className="text-[#e0c0b1]">Downloadable resources</span>
            </div>
          </div>

          {/* ✅ Guarantee - NO border-t, uses spacing + tonal shift */}
          <div className="pt-6 mt-2 bg-[#0e0e0e] rounded-[min(var(--radius-md),4px)] p-4 text-center">
            <p className="text-xs text-[#8a8a8a]">
              <span className="material-symbols-outlined text-[#f97316] text-sm align-middle mr-1">
                verified
              </span>
              30-day money-back guarantee
            </p>
          </div>
        </div>

        {/* ✅ Amber Accent Line - slides in from left on hover */}
        <div className="h-0.5 bg-gradient-to-r from-[#f97316] to-transparent w-0 group-hover:w-full transition-all duration-300" />
      </div>
    </div>
  );
}
