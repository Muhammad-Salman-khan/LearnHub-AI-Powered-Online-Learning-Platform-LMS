import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/instructor/stats-overview";
import { CoursesTable } from "@/components/instructor/courses-table";
import { EmptyState } from "@/components/instructor/empty-state";
import { CreateCourseBtn } from "@/components/instructor/create-course-btn";

// --- Integration Imports ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseByInstructor } from "@/server/action"; 
import { redirect } from "next/navigation";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/login");
  
  // 1. Role Check (Check karein ke session mein role "INSTRUCTOR" hi hai)
  if (session.user.role !== "INSTRUCTOR") {
    redirect("/dashboard/student");
  }

  // 2. Fetch Data (Direct response check)
  const response = await getCourseByInstructor(1, 100);

  // ✅ Improved Data Extraction
  const rawCourses = response && response.success && response.data && Array.isArray(response.data.items)
    ? response.data.items
    : [];

  // 3. Mapping
  const formattedCourses = rawCourses.map((course: any) => ({
    ...course,
    status: (course.isPublished ? "published" : "draft") as "published" | "draft",
    students: course.students || course._count?.enrollments || 0,
  }));

  const stats = {
    totalCourses: formattedCourses.length,
    publishedCourses: formattedCourses.filter((c: any) => c.status === "published").length,
    totalStudents: formattedCourses.reduce((acc: number, curr: any) => acc + (curr.students || 0), 0),
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="instructor" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* ✅ DashboardNavbar check karein ke role aur title le raha hai */}
        <DashboardNavbar title="Instructor Dashboard" role="instructor" />

        <div className="flex-1 overflow-y-auto p-0">
          <div className="w-full px-6 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {session.user.name || "Instructor"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your courses and track student progress
                </p>
              </div>
              <CreateCourseBtn />
            </div>

            <StatsOverview stats={stats} />

            {/* Courses display logic */}
            {formattedCourses.length > 0 ? (
              <CoursesTable courses={formattedCourses} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}