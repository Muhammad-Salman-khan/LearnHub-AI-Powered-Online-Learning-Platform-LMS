"use client";

interface StatsOverviewProps {
  stats: {
    totalCourses: number;
    totalStudents: number;
    publishedCourses: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: "library_books",
      color: "text-primary",
    },
    {
      label: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: "group",
      color: "text-green-500",
    },
    {
      label: "Published Courses",
      value: stats.publishedCourses,
      icon: "check_circle",
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="glass-card-no-glow rounded-xl p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:amber-glow group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </span>
            <span
              className={`material-symbols-outlined ${stat.color} group-hover:scale-110 transition-transform`}
            >
              {stat.icon}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
