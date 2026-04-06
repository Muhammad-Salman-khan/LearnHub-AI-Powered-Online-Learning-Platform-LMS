import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { CoursesTable } from "@/components/instructor/courses-table";
import { EmptyState } from "@/components/instructor/empty-state";
import { CreateCourseBtn } from "@/components/instructor/create-course-btn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getCourseByInstructor } from "@/server/action"; 
import { redirect } from "next/navigation";

export default async function InstructorCoursesListPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/login");
  
  if (session.user.role !== "INSTRUCTOR") {
    redirect("/dashboard/student");
  }

  // Fetching data from your server action
  const response = await getCourseByInstructor();
  
  // ✅ Error Prevention: Agar data na mile toh empty array use karein
  const rawCourses = response && response.success && Array.isArray(response.data) 
    ? response.data 
    : [];

  const formattedCourses = rawCourses.map((course: any) => ({
    ...course,
    status: course.isPublished ? "published" : "draft",
    students: course.enrolledStudents || 0,
  }));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Luxurious Glow CSS preserved */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="instructor" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar title="My Courses" role="instructor" />

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Manage Courses</h1>
              <CreateCourseBtn />
            </div>

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