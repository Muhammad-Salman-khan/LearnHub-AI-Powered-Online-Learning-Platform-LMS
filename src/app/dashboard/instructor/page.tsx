import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { StatsOverview } from "@/components/instructor/stats-overview";
import { CoursesTable } from "@/components/instructor/courses-table";
import { EmptyState } from "@/components/instructor/empty-state";
import { CreateCourseBtn } from "@/components/instructor/create-course-btn";

// --- Integration Imports ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseByInstructor } from "@/server/action"; // Aapka backend action
import { redirect } from "next/navigation";

export default async function InstructorDashboardPage() {
  // 1. Get Session for Auth & Name
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student");

  // 2. Fetch Real Data from your Backend Action
  const response = await getCourseByInstructor();
  
  // Data safety: Agar success false ho ya data na mile to empty array use karein
  const rawCourses = (response.success && response.data) ? response.data : [];

  // 3. Data Mapping: Database fields ko Table/Stats ke mutabiq set karein
  // Hum 'status' aur 'students' fields manually add kar rahe hain bina backend chhere
  const formattedCourses = rawCourses.map((course: any) => ({
    ...course,
    status: course.isPublished ? "published" : "draft", // Table status logic
    students: course.rating || 0, // Filhaal rating ko students ki jagah use kiya hai integration ke liye
  }));

  // 4. Calculate Stats from Backend Data
  const stats = {
    totalCourses: formattedCourses.length,
    publishedCourses: formattedCourses.filter((c: any) => c.status === "published").length,
    totalStudents: formattedCourses.reduce((acc: number, curr: any) => acc + (curr.students || 0), 0),
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="hidden md:block w-[240px] flex-shrink-0">
        {/* <DashboardSidebar role="instructor" /> */}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar title="Instructor Dashboard" role="instructor" />

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {session.user.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your courses and track student progress
                </p>
              </div>
              <CreateCourseBtn />
            </div>

            {/* Backend Stats Mapping */}
            <StatsOverview stats={stats} />

            {/* Backend Courses List */}
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