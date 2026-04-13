import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

// Components
import StatCard from "@/components/dashboard/Stat-card";
import CourseCard from "@/components/dashboard/Course-card";
import { Button } from "@/components/ui/button";

// --- Backend Actions ---
import { getEnrolledCourses, getCourseProgress } from "@/server/action";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;

  // Fetch enrolled courses
  const enrolledRes = await getEnrolledCourses(userId, 1, 100);
  const rawEnrolledCourses = (enrolledRes.success && enrolledRes.data ? enrolledRes.data.items : []) ?? [];

  // Fetch progress for each enrolled course
  const coursesWithProgress = await Promise.all(
    rawEnrolledCourses.map(async (course: any) => {
      const progressRes = await getCourseProgress(userId, course.id);
      const progress = (progressRes.success && progressRes.data) ? progressRes.data : { completed: 0, total: 0, percentage: 0 };
      return {
        ...course,
        progress: progress.percentage || 0,
        chaptersCompleted: progress.completed || 0,
        chaptersTotal: progress.total || 0,
      };
    })
  );

  // Stats
  const stats = {
    enrolled: coursesWithProgress.length,
    completed: coursesWithProgress.filter((c) => c.progress === 100).length,
    inProgress: coursesWithProgress.filter((c) => c.progress > 0 && c.progress < 100).length,
  };

  const userName = session?.user?.name || "Student";

  return (
    <div className="space-y-6 px-6 py-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 text-glow break-words">
            Welcome back, {userName}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Continue your learning journey
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-medium transition-all"
        >
          <Link href="/courses" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Browse All Courses
          </Link>
        </Button>
      </div>

      {/* Stat Chips */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <StatCard label="Enrolled" value={stats.enrolled} icon={BookOpen} color="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="green" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="amber" />
      </div>

      {/* Continue Learning Section */}
      {coursesWithProgress.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
              Continue Learning
            </h2>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
            {coursesWithProgress.slice(0, 5).map((course: any) => (
              <div
                key={`enrolled-${course.id}`}
                className="snap-start shrink-0 w-[280px] sm:w-[300px] max-w-[calc(100vw-2rem)]"
              >
                <CourseCard 
                  course={{
                    ...course,
                    instructor: course.instructor?.name || "Unknown",
                    lastChapterId: null, // Will be handled by router
                  }} 
                  variant="horizontal" 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Enrolled Courses */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
            Your Courses
          </h2>
        </div>

        {coursesWithProgress.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {coursesWithProgress.map((course) => (
              <CourseCard 
                key={course.id} 
                course={{
                  ...course,
                  instructor: course.instructor?.name || "Unknown",
                  lastChapterId: null,
                }} 
                variant="grid" 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 glass-card-no-glow rounded-xl">
             <h3 className="text-gray-200 font-semibold mb-4">You haven't enrolled in any courses yet</h3>
             <Button asChild className="bg-[#F97316] hover:bg-[#F97316]/90 text-white border-0">
               <Link href="/courses">Browse Catalog</Link>
             </Button>
          </div>
        )}
      </section>
    </div>
  );
}