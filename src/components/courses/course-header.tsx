import Image from "next/image";

/**
 * CourseHeader — Scholarly Architect Design System
 *
 * Hero section for course detail page.
 * Background: surface-container-low — architectural section break.
 * No gradients, no glow. Tonal depth via nested surfaces.
 * 12-col split: text left (8 cols) + thumbnail right (4 cols).
 */

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

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    /* Section background shift = architectural separator (No-Line Rule) */
    <header style={{ backgroundColor: "var(--surface-container-low)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left content — 8 cols */}
          <div className="lg:col-span-8">

            {/* Category + level chips */}
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--primary-container)", color: "var(--on-primary-container)" }}
              >
                {course.category}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--surface-container-high)", color: "var(--on-surface-variant)" }}
              >
                {course.level}
              </span>
            </div>

            {/* Course title — Manrope display */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed mb-6 max-w-3xl" style={{ color: "var(--on-surface-variant)" }}>
              {course.description}
            </p>

            {/* Meta row — rating + date */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined fill-icon text-lg"
                  style={{ color: "var(--primary)" }}
                >
                  star
                </span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
                >
                  {course.rating ?? "4.5"}
                </span>
                <span style={{ color: "var(--on-surface-variant)" }}>
                  ({course.students ?? "1.2k"} students)
                </span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "var(--on-surface-variant)" }}>
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span>Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Right — thumbnail (4 cols, desktop only) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div
              className="relative aspect-video rounded-lg overflow-hidden ambient-shadow"
              style={{ backgroundColor: "var(--surface-container-high)" }}
            >
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    school
                  </span>
                </div>
              )}

              {/* Play button overlay — editorial touch */}
              {course.thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--surface-variant)" }}
                  >
                    <span
                      className="material-symbols-outlined fill-icon text-3xl"
                      style={{ color: "var(--primary)" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
