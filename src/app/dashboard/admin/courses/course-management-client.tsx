"use client";

import { useState, useTransition } from "react";
import { CourseSearchBar } from "@/components/admin/course/course-search-bar";
import { StatusFilterTabs } from "@/components/admin/course/status-filter-tabs";
import { UnpublishDialog } from "@/components/admin/course/unpublish-dialog";
import { DeleteCourseDialog } from "@/components/admin/course/delete-course-dialog";
import { toggleCoursePublish, deleteCourseByAdmin } from "@/server/action";
import { toast } from "sonner";
import { CourseTable } from "@/components/admin/course/course-table";

export default function CourseManagementClient({
  initialCourses,
}: {
  initialCourses: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [unpublishDialogCourse, setUnpublishDialogCourse] = useState<any>(null);
  const [deleteDialogCourse, setDeleteDialogCourse] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const coursesPerPage = 10;

  // Filtering Logic
  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "published") {
      matchesStatus = course.status === "Published";
    } else if (statusFilter === "draft") {
      matchesStatus = course.status === "Draft";
    } else if (statusFilter === "unpublished") {
      matchesStatus = course.status === "Unpublished";
    }
    
    return matchesSearch && matchesStatus;
  });

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage,
  );

  // Real Delete Functionality
  const handleDelete = async () => {
    if (!deleteDialogCourse) return;

    startTransition(async () => {
      try {
        const res = await deleteCourseByAdmin(deleteDialogCourse.id);
        if (res.success) {
          toast.success(res.message || "Course deleted successfully");
          setDeleteDialogCourse(null);
          window.location.reload();
        } else {
          toast.error(res.error || "Failed to delete course");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  // Real Unpublish/Publish Functionality
  const handleUnpublish = async () => {
    if (!unpublishDialogCourse) return;

    startTransition(async () => {
      try {
        const res = await toggleCoursePublish(unpublishDialogCourse.id);
        if (res.success) {
          toast.success(res.message || "Course status updated");
          setUnpublishDialogCourse(null);
          window.location.reload();
        } else {
          toast.error(res.error || "Failed to update course status");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <>
      <CourseSearchBar value={searchQuery} onChange={setSearchQuery} />
      <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

      {/* Loading state visual filter */}
      <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : ""}>
        <CourseTable
          courses={paginatedCourses}
          totalCourses={filteredCourses.length}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCourses.length / coursesPerPage)}
          onPageChange={setCurrentPage}
          onUnpublishClick={(course) => setUnpublishDialogCourse(course)}
          onDeleteClick={(course) => setDeleteDialogCourse(course)}
        />
      </div>

      <UnpublishDialog
        open={!!unpublishDialogCourse}
        onOpenChange={(open) => !open && setUnpublishDialogCourse(null)}
        course={unpublishDialogCourse}
        onConfirm={handleUnpublish}
      />

      <DeleteCourseDialog
        open={!!deleteDialogCourse}
        onOpenChange={(open) => !open && setDeleteDialogCourse(null)}
        course={deleteDialogCourse}
        onConfirm={handleDelete}
      />
    </>
  );
}