/**
 * CoursesPage — Scholarly Architect Design System
 *
 * Layout:
 *   Header    — search bar with icon + filter/sort buttons, category chips
 *   Grid      — 4-col course cards (no sidebar)
 *   Pagination — numbered pages + prev/next arrows
 *
 * Backend preserved: getSearchedCourses({ query, category, level, page, pageSize })
 */

import { CourseCard } from "@/components/courses/course-card";
import Link from "next/link";
import { getSearchedCourses } from "@/server/action";

export const metadata = {
  title: "Courses | LearnHub",
  description:
    "Browse LearnHub's curated catalog — web development, Python, data science, design, and more.",
};

/* Category chips for quick-filter strip */
const CATEGORY_CHIPS = [
  "All Courses",
  "Development",
  "Data Science",
  "Design",
  "Backend",
  "DevOps",
  "Mobile",
  "AI/ML",
  "Security",
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    level?: string;
    price?: string;
    page?: string;
  }>;
}) {
  /* Fetch courses from server action (backend unchanged) */
  const params = await searchParams;
  const coursesRes = await getSearchedCourses({
    query: params.search,
    category: params.category,
    level: params.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    page: params.page ? parseInt(params.page, 10) : 1,
    pageSize: 12,
  });

  const courses =
    coursesRes.success && coursesRes.data ? coursesRes.data.items : [];
  const total =
    coursesRes.success && coursesRes.data ? coursesRes.data.total : 0;
  const totalPages =
    coursesRes.success && coursesRes.data ? coursesRes.data.totalPages : 0;
  const currentPage =
    coursesRes.success && coursesRes.data ? coursesRes.data.page : 1;

  /* Build a URL with updated page param */
  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams(params as Record<string, string>);
    p.set("page", String(page));
    return `/courses?${p.toString()}`;
  };

  /* Build a URL with updated category chip */
  const buildCategoryUrl = (cat: string) => {
    const p = new URLSearchParams(params as Record<string, string>);
    if (cat === "All Courses") p.delete("category");
    else p.set("category", cat);
    p.delete("page");
    return `/courses?${p.toString()}`;
  };

  return (
    <main style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      {/* Page content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Sort Header */}
        <section className="mb-12 space-y-6">
          {/* Title block */}
          <div className="flex flex-col gap-4">
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              Browse Courses
            </h1>
            <p
              className="max-w-2xl leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Expand your knowledge and professional skills with our curated
              directory of educational courses.
            </p>
          </div>

          {/* Search Bar Layout */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input with icon */}
            <form className="relative flex-grow" action="/courses" method="GET">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--on-surface-variant)" }}
              >
                search
              </span>
              <input
                type="search"
                name="search"
                defaultValue={params.search}
                placeholder="Search by topic, software, or instructor..."
                className="w-full pl-12 pr-4 py-4 border-none rounded shadow-sm outline-none transition-shadow"
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  color: "var(--on-surface)",
                }}
              />
              {/* Preserve other params on search */}
              {params.category && (
                <input type="hidden" name="category" value={params.category} />
              )}
              {params.level && (
                <input type="hidden" name="level" value={params.level} />
              )}
            </form>

            {/* Filter and Sort buttons */}
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-6 py-4 font-medium rounded transition-colors"
                style={{
                  backgroundColor: "var(--surface-container)",
                  color: "var(--on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined text-sm">
                  filter_list
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Filters
                </span>
              </button>
              <button
                className="flex items-center gap-2 px-6 py-4 font-medium rounded transition-colors"
                style={{
                  backgroundColor: "var(--surface-container)",
                  color: "var(--on-surface-variant)",
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Sort: Relevant
                </span>
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORY_CHIPS.map((cat) => {
              const isActive =
                cat === "All Courses"
                  ? !params.category
                  : params.category === cat;
              return (
                <Link
                  key={cat}
                  href={buildCategoryUrl(cat)}
                  className="px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "var(--surface-container-low)",
                    color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  instructor: {
                    name: course.instructor?.name || "Unknown",
                    image: course.instructor?.image || null,
                  },
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-20 rounded-lg text-center"
            style={{ backgroundColor: "var(--surface-container-lowest)" }}
          >
            <span
              className="material-symbols-outlined text-5xl mb-4"
              style={{ color: "var(--outline-variant)" }}
            >
              search_off
            </span>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              No courses found
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--on-surface-variant)" }}>
              Try adjusting your filters or search terms
            </p>
            <Link
              href="/courses"
              className="text-sm font-medium scholar-link"
            >
              Clear all filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-1.5 mt-16"
            aria-label="Pagination"
          >
            {/* Previous */}
            {currentPage > 1 ? (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="flex items-center justify-center w-9 h-9 rounded transition-all duration-200"
                style={{ backgroundColor: "var(--surface-container)", color: "var(--on-surface)" }}
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </Link>
            ) : (
              <span
                className="flex items-center justify-center w-9 h-9 rounded opacity-30"
                style={{ backgroundColor: "var(--surface-container)", color: "var(--on-surface)" }}
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </span>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <Link
                  key={page}
                  href={buildPageUrl(page)}
                  className="flex items-center justify-center w-9 h-9 rounded text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "var(--surface-container)",
                    color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)",
                    fontFamily: "var(--font-headline)",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Link>
              );
            })}

            {/* Next */}
            {currentPage < totalPages ? (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="flex items-center justify-center w-9 h-9 rounded transition-all duration-200"
                style={{ backgroundColor: "var(--surface-container)", color: "var(--on-surface)" }}
                aria-label="Next page"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </Link>
            ) : (
              <span
                className="flex items-center justify-center w-9 h-9 rounded opacity-30"
                style={{ backgroundColor: "var(--surface-container)", color: "var(--on-surface)" }}
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
