"use client";

import { useState } from "react";
import { CourseSearchBar } from "@/components/admin/course/course-search-bar";
import { StatusFilterTabs } from "@/components/admin/course/status-filter-tabs";
import { UnpublishDialog } from "@/components/admin/course/unpublish-dialog";
import { DeleteCourseDialog } from "@/components/admin/course/delete-course-dialog";
import { deleteCourseById } from "@/server/action"; // Aapka existing action
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

  const coursesPerPage = 10;

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      course.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage,
  );

  const handleDelete = async () => {
    if (!deleteDialogCourse) return;

    const res = await deleteCourseById(deleteDialogCourse.id);
    if (res.success) {
      toast.success("Course deleted successfully");
      setDeleteDialogCourse(null);
    } else {
      toast.error("Failed to delete course");
    }
  };

  return (
    <>
      <CourseSearchBar value={searchQuery} onChange={setSearchQuery} />
      <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

      <CourseTable
        courses={paginatedCourses}
        totalCourses={filteredCourses.length}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCourses.length / coursesPerPage)}
        onPageChange={setCurrentPage}
        onFeatureToggle={(id, val) => console.log(id, val)}
        onUnpublishClick={(course) => setUnpublishDialogCourse(course)}
        onDeleteClick={(course) => setDeleteDialogCourse(course)}
      />

      <UnpublishDialog
        open={!!unpublishDialogCourse}
        onOpenChange={(open) => !open && setUnpublishDialogCourse(null)}
        course={unpublishDialogCourse}
        onConfirm={() => setUnpublishDialogCourse(null)}
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
