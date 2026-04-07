"use client";

import Link from "next/link";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  instructor: { name: string; image: string | null };
  rating?: number;
  students?: number;
}

interface CourseCardProps {
  course: Course;
}

/**
 * CourseCard - Reusable course display component
 *
 * DESIGN.md Compliance:
 * - No-Line Rule: No borders, uses tonal layering
 * - Card Hover: Transitions to surface_container_high + amber accent line
 * - Amber Radiance: Subtle glow on hover
 * - Typography: Editorial voice with proper hierarchy
 */
export function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `Rs. ${price.toLocaleString()}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30";
      case "INTERMEDIATE":
        return "bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30";
      case "ADVANCED":
        return "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30";
      default:
        return "bg-[#584237]/20 text-[#8a8a8a] border-[#584237]/30";
    }
  };

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] overflow-hidden transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#0e0e0e] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#5a5a5a] text-3xl">
              school
            </span>
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[min(var(--radius-md),4px)] text-xs font-medium bg-[#131313]/90 text-[#e2e2e2] border border-[#584237]/15">
          {course.category}
        </span>

        {/* Price Badge */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[min(var(--radius-md),4px)] text-xs font-bold bg-[#f97316] text-[#131313]">
          {formatPrice(course.price)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Level Tag */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[min(var(--radius-md),4px)] text-xs font-medium border ${getLevelColor(course.level)} mb-3`}
        >
          {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
        </span>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-[#e2e2e2] mb-2 line-clamp-2 group-hover:text-[#f97316] transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#e0c0b1] mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#0e0e0e] overflow-hidden flex-shrink-0">
            {course.instructor.image ? (
              <Image
                src={course.instructor.image}
                alt={course.instructor.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#8a8a8a] text-sm">
                  person
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-[#8a8a8a]">
            {course.instructor.name}
          </span>
        </div>

        {/* Footer: Rating + Students */}
        <div className="flex items-center justify-between pt-3 border-t border-[#584237]/10">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#f97316] text-sm">
              star
            </span>
            <span className="text-sm font-medium text-[#e2e2e2]">
              {course.rating || "4.5"}
            </span>
            <span className="text-xs text-[#8a8a8a]">
              ({course.students || "1.2k"})
            </span>
          </div>
          <span className="material-symbols-outlined text-[#8a8a8a] group-hover:text-[#f97316] group-hover:translate-x-0.5 transition-all text-sm">
            north_east
          </span>
        </div>
      </div>

      {/* Amber Accent Line (slides in on hover) */}
      <div className="h-0.5 bg-gradient-to-r from-[#f97316] to-transparent w-0 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
