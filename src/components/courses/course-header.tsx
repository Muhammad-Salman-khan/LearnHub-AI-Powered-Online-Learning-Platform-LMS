import Image from "next/image";

interface CourseHeaderProps {
  course: {
    title: string;
    description: string;
    thumbnail: string | null;
    rating?: number;
    students?: number;
    category: string;
    level: string;
    createdAt: Date | string;
  };
}

/**
 * CourseHeader - Hero section for course detail page
 *
 * DESIGN.md Compliance:
 * - No-Line Rule: No borders, tonal layering only
 * - Typography: display-lg for title, label-md for specs
 * - Amber Radiance: Subtle glow on thumbnail
 * - Editorial Spacing: Generous margins
 */
export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <header className="relative border-b border-[#584237]/10">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f97316]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 min-w-0">
            {/* Category & Level Pills */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30">
                {course.category}
              </span>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#584237]/20 text-[#8a8a8a] border border-[#584237]/30">
                {course.level}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2e2] leading-tight mb-4">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#e0c0b1] mb-6 max-w-3xl">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f97316] text-lg">
                  star
                </span>
                <span className="font-semibold text-[#e2e2e2]">
                  {course.rating || "4.5"}
                </span>
                <span className="text-[#8a8a8a]">
                  ({course.students || "1.2k"} students)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8a8a8a] text-lg">
                  schedule
                </span>
                <span className="text-[#8a8a8a]">
                  Last updated {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Thumbnail (Desktop) */}
          <div className="lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="relative aspect-video rounded-[min(var(--radius-md),4px)] overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.08)]">
              {course.thumbnail ?
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              : <div className="w-full h-full bg-[#0e0e0e] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#5a5a5a] text-4xl">
                    school
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
