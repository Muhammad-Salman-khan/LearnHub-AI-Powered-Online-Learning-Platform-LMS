import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import ChapterManager from "./chapter-manager-client";

export default async function ChapterManagerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student");

  const { courseId } = await params;

  // Fetch course and its chapters
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Verify instructor ownership
  if (course.instructorId !== (session.user as any).id) {
    redirect("/dashboard/instructor/courses");
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="instructor" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar title="Manage Chapters" role="instructor" />

        <div className="flex-1 overflow-y-auto p-0">
          <div className="w-full px-6 py-6">
            <ChapterManager
              courseId={courseId}
              courseTitle={course.title}
              initialChapters={course.chapters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
