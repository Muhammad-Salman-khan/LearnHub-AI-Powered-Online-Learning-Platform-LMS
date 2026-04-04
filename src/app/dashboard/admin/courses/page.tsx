"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { CourseTable } from "@/components/admin/course/course-table";
import { CourseSearchBar } from "@/components/admin/course/course-search-bar";
import { StatusFilterTabs } from "@/components/admin/course/status-filter-tabs";
import { UnpublishDialog } from "@/components/admin/course/unpublish-dialog";
import { DeleteCourseDialog } from "@/components/admin/course/delete-course-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// ⚠️ MOCK DATA
const mockCourses = [
  {
    id: "1",
    title: "Advanced UI Design Systems",
    instructor: "Sarah Khan",
    category: "Design",
    status: "Published",
    createdDate: "2026-04-05",
    students: 850,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Next.js 14 Full Stack",
    instructor: "Zain Ahmed",
    category: "Web Dev",
    status: "Draft",
    createdDate: "2026-04-04",
    students: 0,
    isFeatured: false,
  },
  {
    id: "3",
    title: "Python for Data Science",
    instructor: "Dr. Ahmed",
    category: "Data Science",
    status: "Published",
    createdDate: "2026-04-03",
    students: 420,
    isFeatured: true,
  },
  {
    id: "4",
    title: "DevOps Fundamentals",
    instructor: "Kamal Hassan",
    category: "DevOps",
    status: "Published",
    createdDate: "2026-04-02",
    students: 230,
    isFeatured: false,
  },
  {
    id: "5",
    title: "Mobile App Development",
    instructor: "Ayesha Siddiqui",
    category: "Mobile",
    status: "Draft",
    createdDate: "2026-04-01",
    students: 0,
    isFeatured: false,
  },
  {
    id: "6",
    title: "React Native Mastery",
    instructor: "Ali Raza",
    category: "Mobile",
    status: "Published",
    createdDate: "2026-03-30",
    students: 310,
    isFeatured: false,
  },
  {
    id: "7",
    title: "Machine Learning Basics",
    instructor: "Dr. Fatima",
    category: "Data Science",
    status: "Draft",
    createdDate: "2026-03-28",
    students: 0,
    isFeatured: false,
  },
  {
    id: "8",
    title: "TypeScript Deep Dive",
    instructor: "Hassan Ali",
    category: "Web Dev",
    status: "Published",
    createdDate: "2026-03-25",
    students: 180,
    isFeatured: false,
  },
  {
    id: "9",
    title: "AWS Cloud Practitioner",
    instructor: "Usman Khan",
    category: "DevOps",
    status: "Published",
    createdDate: "2026-03-20",
    students: 290,
    isFeatured: true,
  },
  {
    id: "10",
    title: "Figma for Developers",
    instructor: "Maryam Ali",
    category: "Design",
    status: "Draft",
    createdDate: "2026-03-15",
    students: 0,
    isFeatured: false,
  },
];

export default function CourseManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [unpublishDialogCourse, setUnpublishDialogCourse] = useState<any>(null);
  const [deleteDialogCourse, setDeleteDialogCourse] = useState<any>(null);
  const coursesPerPage = 20;

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      course.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    router.push(`/dashboard/admin/courses?${params.toString()}`, {
      scroll: false,
    });
  }, [searchQuery, statusFilter, router]);

  const handleFeatureToggle = (courseId: string, isFeatured: boolean) => {
    console.log(`Feature course ${courseId}: ${isFeatured}`);
  };

  const handleUnpublishClick = (course: any) => {
    setUnpublishDialogCourse(course);
  };

  const handleDeleteClick = (course: any) => {
    setDeleteDialogCourse(course);
  };

  const confirmUnpublish = () => {
    if (unpublishDialogCourse) {
      console.log(`Unpublish course ${unpublishDialogCourse.id}`);
      setUnpublishDialogCourse(null);
    }
  };

  const confirmDelete = () => {
    if (deleteDialogCourse) {
      console.log(`Delete course ${deleteDialogCourse.id}`);
      setDeleteDialogCourse(null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0 relative z-10">
        <DashboardSidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar
          title="Course Management"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
                    menu_book
                  </span>
                  Course Management
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage all platform courses
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/admin")}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <span className="material-symbols-outlined text-base mr-2">
                  arrow_back
                </span>
                Back
              </Button>
            </div>

            {/* Search Bar */}
            <CourseSearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Status Filter Tabs */}
            <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

            {/* Course Table */}
            <CourseTable
              courses={paginatedCourses}
              totalCourses={filteredCourses.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onFeatureToggle={handleFeatureToggle}
              onUnpublishClick={handleUnpublishClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[240px] p-0 bg-background border-r border-border"
        >
          <DashboardSidebar
            role="admin"
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* ✅ Dialogs - Rendered at root level, never clipped */}
      <UnpublishDialog
        open={!!unpublishDialogCourse}
        onOpenChange={(open) => !open && setUnpublishDialogCourse(null)}
        course={unpublishDialogCourse}
        onConfirm={confirmUnpublish}
      />
      <DeleteCourseDialog
        open={!!deleteDialogCourse}
        onOpenChange={(open) => !open && setDeleteDialogCourse(null)}
        course={deleteDialogCourse}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
