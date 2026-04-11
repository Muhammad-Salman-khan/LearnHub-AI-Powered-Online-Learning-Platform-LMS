import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

// Components
import StatCard from "@/components/dashboard/Stat-card";
import CourseCard from "@/components/dashboard/Course-card";
import { Button } from "@/components/ui/button";

// --- Backend Action ---
import { getAllCourses } from "@/server/action"; 

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const response = await getAllCourses(1, 100);
const rawCourses = (response.success && response.data ? response.data.items : []) ?? [];

  // --- Functionality: Formatting Data ---
  const formattedCourses = rawCourses.map((course: { title: string; description: string; price: number; isPublished: boolean; thumbnail: string | null; id: string; createdAt: Date; category: string; level: string; instructorId: string; rating: number }) => ({
    ...course,
    progress: 0, // Default 0% until progress tracking is implemented
  }));

  // Stats calculate karna
  const stats = {
    enrolled: formattedCourses.length,
    completed: formattedCourses.filter((c) => c.progress === 100).length,
    inProgress: formattedCourses.filter((c) => c.progress < 100).length,
  };

  const userName = session?.user?.name || "Student";

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 text-glow break-words">
          Welcome back, {userName}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Continue your learning journey
        </p>
      </div>

      {/* Stat Chips */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <StatCard label="Enrolled" value={stats.enrolled} icon={BookOpen} color="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="green" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="amber" />
      </div>

      {/* ✅ Section: Continue Learning (Ab Backend se aayega) */}
      {formattedCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
              Continue Learning
            </h2>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
            {formattedCourses.slice(0, 5).map((course: any) => (
              <div
                key={`recent-${course.id}`}
                className="snap-start shrink-0 w-[280px] sm:w-[300px] max-w-[calc(100vw-2rem)]"
              >
                <CourseCard course={course} variant="horizontal" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: All Enrolled Courses */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
            Your Courses
          </h2>
        </div>

        {formattedCourses.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {formattedCourses.map((course) => (
              <CourseCard key={course.id} course={course} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 glass-card-no-glow rounded-xl">
             <h3 className="text-gray-200 font-semibold">No courses found</h3>
             <Button className="kinetic-gradient text-white mt-4 border-0">Browse Catalog</Button>
          </div>
        )}
      </section>
    </div>
  );
}