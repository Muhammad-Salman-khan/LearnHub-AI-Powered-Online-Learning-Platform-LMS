import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrolledCourses, getCourseProgress } from "@/server/action";
import { Progress } from "@/components/ui/progress";

export default async function StudentProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;

  // Fetch enrolled courses
  const enrolledRes = await getEnrolledCourses(userId, 1, 100);
  const rawEnrolledCourses = (enrolledRes.success && enrolledRes.data ? enrolledRes.data.items : []) ?? [];

  // Fetch progress for each course
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

  return (
    <div className="space-y-6 px-6 py-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Your Progress</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Track your learning journey across all enrolled courses
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4 border border-border/50">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-3xl font-bold text-[#F97316]">{coursesWithProgress.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-border/50">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-500">
            {coursesWithProgress.filter((c) => c.progress === 100).length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-border/50">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-3xl font-bold text-[#F97316]">
            {coursesWithProgress.filter((c) => c.progress > 0 && c.progress < 100).length}
          </p>
        </div>
      </div>

      {/* Course Progress List */}
      {coursesWithProgress.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200">Course Progress</h2>
          <div className="grid gap-4 grid-cols-1">
            {coursesWithProgress.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="glass-card rounded-xl p-6 border border-border/50 hover:border-[#F97316]/50 transition-all block"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-200 truncate mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {course.instructor?.name || "Unknown Instructor"}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        {course.chaptersCompleted}/{course.chaptersTotal} chapters
                      </span>
                      <span className={course.progress === 100 ? "text-green-500" : "text-[#F97316]"}>
                        {course.progress === 100 ? "✓ Completed" : `${course.progress}% Complete`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Progress
                      value={course.progress}
                      className="h-2 bg-[#1a1a1a] [&>div]:bg-gradient-to-r [&>div]:from-[#F97316] [&>div]:to-[#ffb690]"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 glass-card-no-glow rounded-xl">
          <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">
            school
          </span>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No courses enrolled yet</h3>
          <p className="text-gray-500 mb-6">Start your learning journey today!</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] text-white rounded-lg font-medium hover:bg-[#F97316]/90 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
