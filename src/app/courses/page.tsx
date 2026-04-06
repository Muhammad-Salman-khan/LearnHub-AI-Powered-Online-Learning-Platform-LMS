/**
 * Course Listing Page - LearnHub
 *
 * Design: Obsidian & Amber Editorial ("The Kinetic Monolith")
 * Features:
 * - Server-side course fetching with Prisma
 * - Client-side filters & search
 * - Responsive grid layout
 * - DESIGN.md compliant: No-Line Rule, Amber Radiance, Editorial spacing
 */

import { prisma } from "@/lib/prisma";
import { CourseFilters } from "../../components/courses/course-filters";
import { CourseCard } from "../../components/courses/course-card";
import Link from "next/link";

// Metadata for SEO
export const metadata = {
  title: "Courses | LearnHub",
  description:
    "Explore our curated collection of deep-tech courses. Master the future of human capital.",
};

// Fetch courses from database
async function getCourses(
  search?: string,
  category?: string,
  level?: string,
  price?: string,
) {
  const where: any = { isPublished: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;
  if (level) where.level = level;
  if (price === "free") where.price = 0;
  if (price === "paid") where.price = { gt: 0 };

  return await prisma.course.findMany({
    where,
    include: { instructor: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// Available filter options
const CATEGORIES = [
  "Web Dev",
  "Data Science",
  "Design",
  "Backend",
  "DevOps",
  "Mobile",
  "AI/ML",
  "Security",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    level?: string;
    price?: string;
  }>;
}) {
  const params = await searchParams;
  const courses = await getCourses(
    params.search,
    params.category,
    params.level,
    params.price,
  );

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Page Header */}
      <header className="relative border-b border-[#584237]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f97316]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#f97316] mb-3">
                The Curriculum
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Explore Our Courses
              </h1>
              <p className="text-[#e0c0b1] mt-3 max-w-2xl">
                Curated deep-tech learning paths designed for precision, speed,
                and absolute mastery.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search courses..."
                  defaultValue={params.search}
                  name="search"
                  className="w-full sm:w-80 h-11 bg-[#0e0e0e] border-0 border-b-2 border-transparent focus:border-[#f97316] focus:ring-0 text-[#e2e2e2] placeholder:text-[#5a5a5a] transition-all duration-300 rounded-none px-4 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#f97316] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    search
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <CourseFilters
              categories={CATEGORIES}
              levels={LEVELS}
              priceOptions={PRICE_OPTIONS}
              currentParams={params}
            />
          </aside>

          {/* Course Grid */}
          <section className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#584237]/10">
              <p className="text-sm text-[#8a8a8a]">
                <span className="text-[#e2e2e2] font-medium">
                  {courses.length}
                </span>{" "}
                courses found
              </p>
              <select className="bg-[#0e0e0e] border-0 border-b-2 border-transparent focus:border-[#f97316] text-[#e2e2e2] text-sm px-3 py-2 rounded-none focus:ring-0">
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Course Cards Grid */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-[#5a5a5a] text-4xl mb-4">
                  search_off
                </span>
                <h3 className="text-lg font-medium text-[#e2e2e2] mb-2">
                  No courses found
                </h3>
                <p className="text-[#8a8a8a] mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Link
                  href="/courses"
                  className="text-[#f97316] hover:text-[#ffb690] transition-colors text-sm font-medium"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
