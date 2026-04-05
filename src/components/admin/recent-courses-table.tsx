"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  status: "Published" | "Draft";
  createdDate: string;
  students: number;
}

interface RecentCoursesTableProps {
  courses: Course[];
}

export function RecentCoursesTable({ courses }: RecentCoursesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card-no-glow rounded-xl border border-border overflow-hidden relative group">
      {/* Animated Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="p-5 border-b border-border flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-shadow duration-300">
            <span className="material-symbols-outlined text-primary text-2xl">
              menu_book
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Recent Courses
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {courses.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">Last 10 created</p>
          </div>
        </div>
        <Link href="/dashboard/admin/courses">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-orange-300 hover:bg-primary/10 border border-primary/20 text-xs transition-all"
          >
            View All
            <span className="material-symbols-outlined text-base ml-1">
              arrow_forward
            </span>
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto relative">
        {/* Table Header Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Course
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                Instructor
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                Students
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {courses.map((course, index) => (
              <tr
                key={course.id}
                className="hover:bg-primary/5 transition-all duration-300 group/row"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {course.title.charAt(0)}
                      </div>
                      <p className="font-medium text-foreground truncate max-w-[180px] group-hover/row:text-primary transition-colors">
                        {course.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground md:hidden">
                      {course.instructor}
                    </p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/30">
                        <span className="material-symbols-outlined text-[10px]">
                          category
                        </span>
                        {course.category}
                      </span>
                    </p>
                  </div>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <div>
                    <p className="text-sm text-foreground">
                      {course.instructor}
                    </p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/30">
                      <span className="material-symbols-outlined text-[10px]">
                        category
                      </span>
                      {course.category}
                    </p>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-300 hover:scale-105 ${
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
                <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-xs">
                      group
                    </span>
                    <span className="font-semibold">{course.students}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
