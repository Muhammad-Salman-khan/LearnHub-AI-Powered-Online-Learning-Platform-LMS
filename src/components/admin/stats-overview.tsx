interface StatsOverviewProps {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: "group",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      glowColor: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      borderColor: "border-blue-500/30",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: "menu_book",
      color: "text-primary",
      bgColor: "bg-primary/10",
      glowColor: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
      borderColor: "border-primary/30",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      icon: "assignment",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
      borderColor: "border-purple-500/30",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: "attach_money",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      glowColor: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`glass-card-no-glow rounded-xl p-5 border transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden ${stat.borderColor} hover:${stat.glowColor}`}
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Accent Bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${stat.color.replace("text-", "")} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`}
          />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </span>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${stat.glowColor}`}
              >
                <span
                  className={`material-symbols-outlined ${stat.color} text-2xl`}
                >
                  {stat.icon}
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {stat.value}
            </p>
            {/* Subtle Glow Under Value */}
            <div
              className={`h-1 w-0 group-hover:w-full transition-all duration-500 mt-2 rounded-full bg-gradient-to-r from-transparent via-${stat.color.replace("text-", "")} to-transparent opacity-30`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
