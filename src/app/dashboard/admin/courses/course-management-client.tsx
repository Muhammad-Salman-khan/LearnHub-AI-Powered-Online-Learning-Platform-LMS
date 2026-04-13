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
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [unpublishDialogCourse, setUnpublishDialogCourse] = useState<any>(null);
  const [deleteDialogCourse, setDeleteDialogCourse] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const coursesPerPage = 10;

  // Filtering Logic
  const filteredCourses = courses.filter((course) => {
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

  // Instant Delete - updates local state immediately
  const handleDelete = async () => {
    if (!deleteDialogCourse) return;

    const courseIdToDelete = deleteDialogCourse.id;
    
    // Instantly remove from local state
    setCourses((prev) => prev.filter((c) => c.id !== courseIdToDelete));
    setDeleteDialogCourse(null);

    startTransition(async () => {
      try {
        const res = await deleteCourseByAdmin(courseIdToDelete);
        if (res.success) {
          toast.success(res.message || "Course deleted successfully");
        } else {
          // Revert if server fails
          toast.error(res.error || "Failed to delete course");
          setCourses((prev) => [...prev, deleteDialogCourse]);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        // Revert if server fails
        setCourses((prev) => [...prev, deleteDialogCourse]);
      }
    });
  };

  // Instant Unpublish/Publish - updates local state immediately
  const handleUnpublish = async () => {
    if (!unpublishDialogCourse) return;

    const courseId = unpublishDialogCourse.id;
    const currentStatus = unpublishDialogCourse.status;
    const newStatus = currentStatus === "Published" ? "Unpublished" : "Published";
    
    // Instantly update local state
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, status: newStatus } : c
      )
    );
    setUnpublishDialogCourse(null);

    startTransition(async () => {
      try {
        const res = await toggleCoursePublish(courseId);
        if (res.success) {
          toast.success(res.message || "Course status updated");
        } else {
          // Revert if server fails
          toast.error(res.error || "Failed to update course status");
          setCourses((prev) =>
            prev.map((c) =>
              c.id === courseId ? { ...c, status: currentStatus } : c
            )
          );
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        // Revert if server fails
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, status: currentStatus } : c
          )
        );
      }
    });
  };

  return (
    <>
      <CourseSearchBar value={searchQuery} onChange={setSearchQuery} />
      <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

      {/* No loading overlay - instant updates */}
      <CourseTable
        courses={paginatedCourses}
        totalCourses={filteredCourses.length}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCourses.length / coursesPerPage)}
        onPageChange={setCurrentPage}
        onUnpublishClick={(course) => setUnpublishDialogCourse(course)}
        onDeleteClick={(course) => setDeleteDialogCourse(course)}
      />

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