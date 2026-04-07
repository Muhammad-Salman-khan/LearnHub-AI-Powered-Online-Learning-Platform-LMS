/**
 * Courses Loading State - Skeleton screens
 *
 * DESIGN.md Compliance:
 * - Uses surface hierarchy for skeleton cards
 * - Amber pulse animation for loading indicators
 * - Matches course card layout for seamless transition
 */

export default function CoursesLoading() {
  // Generate 6 skeleton cards
  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Header Skeleton */}
      <header className="relative border-b border-[#584237]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="h-3 w-32 bg-[#1b1b1b] rounded mb-3 animate-pulse" />
              <div className="h-8 sm:h-10 w-64 bg-[#1b1b1b] rounded animate-pulse" />
              <div className="h-4 w-80 bg-[#1b1b1b] rounded mt-3 animate-pulse" />
            </div>
            <div className="w-full sm:w-80 h-11 bg-[#0e0e0e] rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-4 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-3 w-20 bg-[#0e0e0e] rounded mb-3 animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-4 w-full bg-[#0e0e0e] rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Course Grid Skeleton */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#584237]/10">
              <div className="h-4 w-32 bg-[#1b1b1b] rounded animate-pulse" />
              <div className="h-8 w-40 bg-[#0e0e0e] rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {skeletons.map((i) => (
                <div
                  key={i}
                  className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] overflow-hidden animate-pulse"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="aspect-video bg-[#0e0e0e]" />

                  {/* Content Skeleton */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="h-4 w-20 bg-[#0e0e0e] rounded" />
                    <div className="h-5 w-full bg-[#0e0e0e] rounded" />
                    <div className="h-4 w-3/4 bg-[#0e0e0e] rounded" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0e0e0e]" />
                      <div className="h-4 w-32 bg-[#0e0e0e] rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#584237]/10">
                      <div className="h-4 w-16 bg-[#0e0e0e] rounded" />
                      <div className="h-4 w-4 bg-[#0e0e0e] rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
