/**
 * StatsOverview (Instructor) — Scholarly Architect Design System
 *
 * 3-col stat row for instructor dashboard.
 * Cards: surface-container-lowest bg, left-edge 4px primary accent.
 * No glow, no gradients, no borders. Manrope for numbers.
 * Uses CSS variables for dark mode support.
 */

interface StatsOverviewProps {
  stats: {
    totalCourses: number;
    totalStudents: number;
    publishedCourses: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    { label: "Total Courses", value: stats.totalCourses, icon: "library_books" },
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: "group" },
    { label: "Published", value: stats.publishedCourses, icon: "check_circle" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg p-5 flex items-start gap-4"
          style={{
            backgroundColor: "var(--surface-container-lowest)",
            borderLeft: "4px solid var(--primary)",
          }}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ color: "var(--primary)" }}
          >
            {card.icon}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--on-surface-variant)" }}>
              {card.label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
