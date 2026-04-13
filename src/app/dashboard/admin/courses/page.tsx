import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { getAllCoursesWithEnrollments } from "@/server/action";
import CourseManagementClient from "./course-management-client";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Strict Role Check
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const response = await getAllCoursesWithEnrollments(1, 100);
  const dbCourses = (response.success && response.data ? response.data.items : []) ?? [];

  const formattedCourses = dbCourses.map((course: any) => ({
    id: course.id,
    title: course.title,
    instructor: course.instructor?.name || "Unknown",
    category: course.category,
    status: course.isPublished ? "Published" : "Unpublished",
    createdDate: new Date(course.createdAt).toLocaleDateString(),
    students: course.students || 0,
    isFeatured: false,
  }));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar title="Course Management" role="admin" />

        <div className="flex-1 overflow-y-auto p-0">
          <div className="w-full space-y-6 px-6 py-6">
            <CourseManagementClient initialCourses={formattedCourses} />
          </div>
        </div>
      </div>
    </div>
  );
}
