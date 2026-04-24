/**
 * Loading — Scholarly Architect Design System
 *
 * Full-page skeleton loader with pulsing animation.
 * Matches course card layout structure.
 */

export default function Loading() {
  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "#fcf9f8" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12 space-y-6">
          <div className="space-y-4">
            <div
              className="h-10 rounded w-64 animate-pulse"
              style={{ backgroundColor: "#f0eded" }}
            />
            <div
              className="h-6 rounded w-full max-w-2xl animate-pulse"
              style={{ backgroundColor: "#f0eded" }}
            />
          </div>

          {/* Search bar skeleton */}
          <div
            className="h-14 rounded animate-pulse"
            style={{ backgroundColor: "#f0eded" }}
          />

          {/* Category chips skeleton */}
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-full animate-pulse"
                style={{ backgroundColor: "#f0eded" }}
              />
            ))}
          </div>
        </div>

        {/* Course grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Thumbnail */}
              <div
                className="aspect-video rounded animate-pulse"
                style={{ backgroundColor: "#f0eded" }}
              />
              {/* Content */}
              <div className="space-y-2">
                <div
                  className="h-3 rounded w-20 animate-pulse"
                  style={{ backgroundColor: "#f0eded" }}
                />
                <div
                  className="h-5 rounded w-full animate-pulse"
                  style={{ backgroundColor: "#f0eded" }}
                />
                <div
                  className="h-4 rounded w-24 animate-pulse"
                  style={{ backgroundColor: "#f0eded" }}
                />
                <div
                  className="h-6 rounded w-16 animate-pulse"
                  style={{ backgroundColor: "#f0eded" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
