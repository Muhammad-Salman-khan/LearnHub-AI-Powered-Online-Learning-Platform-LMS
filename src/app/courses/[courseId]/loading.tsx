/**
 * Course Detail Loading State - Skeleton screens
 *
 * DESIGN.md Compliance:
 * - Uses surface hierarchy for skeleton cards
 * - Amber pulse animation for loading indicators
 * - Matches course detail layout for seamless transition
 */

export default function CourseDetailLoading() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Header Skeleton */}
      <header className="relative border-b border-[#584237]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-[#1b1b1b] rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-[#1b1b1b] rounded-full animate-pulse" />
              </div>
              <div className="h-8 sm:h-10 w-3/4 bg-[#1b1b1b] rounded animate-pulse" />
              <div className="h-4 w-full bg-[#1b1b1b] rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-[#1b1b1b] rounded animate-pulse" />
            </div>
            <div className="lg:w-80 hidden lg:block">
              <div className="aspect-video bg-[#0e0e0e] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Content Skeleton */}
          <section className="flex-1 min-w-0 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-[#1b1b1b] rounded p-6 sm:p-8 space-y-4 animate-pulse">
              <div className="h-6 w-40 bg-[#0e0e0e] rounded" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-full bg-[#0e0e0e] rounded" />
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-[#1b1b1b] rounded overflow-hidden animate-pulse">
              <div className="p-6 border-b border-[#584237]/10">
                <div className="h-6 w-40 bg-[#0e0e0e] rounded" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-b border-[#584237]/10">
                  <div className="h-5 w-3/4 bg-[#0e0e0e] rounded" />
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar Skeleton */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-[#1b1b1b] rounded p-6 space-y-6 animate-pulse">
              <div className="h-10 w-32 bg-[#0e0e0e] rounded mx-auto" />
              <div className="h-12 w-full bg-[#0e0e0e] rounded" />
              <div className="space-y-3 pt-4 border-t border-[#584237]/10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-[#0e0e0e] rounded" />
                    <div className="h-4 w-32 bg-[#0e0e0e] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
