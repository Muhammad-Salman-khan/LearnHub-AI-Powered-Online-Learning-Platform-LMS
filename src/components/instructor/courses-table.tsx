"use client";

import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft";
  students: number;
  thumbnail: string;
}

interface CoursesTableProps {
  courses: Course[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Courses</h2>
        <span className="text-sm text-muted-foreground">
          {courses.length} courses found
        </span>
      </div>

      <div className="glass-card-no-glow rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Course
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Category
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
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {course.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-[200px]">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {course.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                    {course.category}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === "published"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {course.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                    {course.students}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <span className="material-symbols-outlined text-base">
                          edit
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <span className="material-symbols-outlined text-base">
                          visibility
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
