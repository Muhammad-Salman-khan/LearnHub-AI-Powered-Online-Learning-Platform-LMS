/**
 * StatsOverview (Admin) — Scholarly Architect Design System
 *
 * 4-col bento grid for admin dashboard.
 * Cards: surface-container-lowest bg, left-edge 4px primary accent.
 * Manrope for numbers. No glow, no gradients.
 * Uses CSS variables for dark mode support.
 */

interface StatsOverviewProps {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "group" },
    { label: "Total Courses", value: stats.totalCourses.toLocaleString(), icon: "menu_book" },
    { label: "Enrollments", value: stats.totalEnrollments.toLocaleString(), icon: "assignment" },
    { label: "Revenue", value: `Rs. ${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: "attach_money" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg p-5"
          style={{
            backgroundColor: "var(--surface-container-lowest)",
            borderLeft: "4px solid var(--primary)",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
              {card.label}
            </p>
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: "var(--primary)" }}
            >
              {card.icon}
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
