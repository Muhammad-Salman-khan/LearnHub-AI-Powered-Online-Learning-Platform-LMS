"use client";

import { Button } from "@/components/ui/button";
import { FeatureToggle } from "./feature-toggle";

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  status: "Published" | "Draft";
  createdDate: string;
  students: number;
  isFeatured: boolean;
}

interface CourseTableProps {
  courses: Course[];
  totalCourses: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFeatureToggle: (courseId: string, isFeatured: boolean) => void;
  onUnpublishClick: (course: Course) => void;
  onDeleteClick: (course: Course) => void;
}

export function CourseTable({
  courses,
  totalCourses,
  currentPage,
  totalPages,
  onPageChange,
  onFeatureToggle,
  onUnpublishClick,
  onDeleteClick,
}: CourseTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card-no-glow rounded-xl border border-border overflow-hidden relative group">
      <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Course
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                Instructor
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Category
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                Created
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Students
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-muted-foreground">
                        folder_open
                      </span>
                    </div>
                    <p className="text-muted-foreground">No courses found</p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr
                  key={course.id}
                  className="hover:bg-primary/5 transition-all duration-300 group/row table-row-glow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover/row:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                        {course.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-[200px] group-hover/row:text-primary transition-colors">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground lg:hidden">
                          {course.instructor}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground hidden lg:table-cell">
                    {course.instructor}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/30 text-xs text-muted-foreground">
                      <span className="material-symbols-outlined text-[10px]">
                        category
                      </span>
                      {course.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/30">
                      <span className="material-symbols-outlined text-xs text-primary">
                        calendar_today
                      </span>
                      {formatDate(course.createdDate)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-300 ${
                        course.status === "Published"
                          ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                          : "bg-muted/30 text-muted-foreground border-border"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${course.status === "Published" ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`}
                      />
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-xs">
                        group
                      </span>
                      <span className="font-semibold">{course.students}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <FeatureToggle
                        isFeatured={course.isFeatured}
                        courseId={course.id}
                        onToggle={onFeatureToggle}
                      />
                      {course.status === "Published" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnpublishClick(course)}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300 hover:scale-105"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility_off
                          </span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteClick(course)}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300 hover:scale-105"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-primary font-medium">
              {(currentPage - 1) * 20 + 1}
            </span>{" "}
            to{" "}
            <span className="text-primary font-medium">
              {Math.min(currentPage * 20, totalCourses)}
            </span>{" "}
            of <span className="text-primary font-medium">{totalCourses}</span>{" "}
            courses
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-border text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                chevron_left
              </span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        : "bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-border text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                chevron_right
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
