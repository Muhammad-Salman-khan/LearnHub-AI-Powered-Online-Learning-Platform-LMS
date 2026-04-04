"use client";

import { useSession } from "next-auth/react";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import StatCard from "@/components/dashboard/Stat-card";
import CourseCard from "@/components/dashboard/Course-card";
import { Button } from "@/components/ui/button";

// Mock data for Phase 1
const stats = { enrolled: 4, completed: 1, inProgress: 3 };

const recentCourses = [
  {
    id: "1",
    title: "Advanced React Patterns",
    instructor: "Zaid Khan",
    progress: 45,
    thumbnail: "https://i.ytimg.com/vi/FFZSgalRSQQ/maxresdefault.jpg",
    lastChapterId: "ch-3",
    category: "Web Dev",
  },
  {
    id: "2",
    title: "Node.js Masterclass",
    instructor: "Ali Ahmed",
    progress: 12,
    thumbnail:
      "https://img.freepik.com/free-psd/creative-youtube-thumbnail-design-template_505751-6257.jpg?semt=ais_incoming&w=740&q=80",
    lastChapterId: "ch-1",
    category: "Backend",
  },
];

const allCourses = [
  ...recentCourses,
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Sara Ali",
    progress: 0,
    thumbnail:
      "https://marketplace.canva.com/EAFAMirCsX4/4/0/1600w/canva-purple-creative-livestream-youtube-thumbnail-jW5Q1psYEac.jpg",
    lastChapterId: null,
    category: "Design",
  },
  {
    id: "4",
    title: "Python for Data Science",
    instructor: "Hassan Raza",
    progress: 100,
    thumbnail:
      "https://marketplace.canva.com/EAE-W8aejEE/2/0/1600w/canva-dark-modern-elegant-singer-new-song-youtube-thumbnail-kfaUPpKvbJo.jpg",
    lastChapterId: "ch-10",
    category: "Data Science",
  },
];

export default function StudentDashboard() {
  const { session } = useSession();
  const userName = session?.user?.name || "Student";

  return (
    // ✅ Main wrapper: overflow-x-hidden to prevent horizontal scroll
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 text-glow break-words">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Continue your learning journey
        </p>
      </div>

      {/* Stat Chips - ✅ Full width on mobile */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <StatCard
          label="Enrolled"
          value={stats.enrolled}
          icon={BookOpen}
          color="amber"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Continue Learning Section - ✅ Proper mobile scroll */}
      {recentCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
              Continue Learning
            </h2>
          </div>

          {/* ✅ Scroll container: proper width calculation */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
            {recentCourses.map((course) => (
              // ✅ Card wrapper: fixed width for horizontal scroll
              <div
                key={course.id}
                className="snap-start shrink-0 w-[280px] sm:w-[300px] max-w-[calc(100vw-2rem)]"
              >
                {/* ✅ FIXED: variant="horizontal" for scroll cards */}
                <CourseCard course={course} variant="horizontal" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Enrolled Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-[#F97316] rounded-full shrink-0"></span>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
            All Enrolled Courses
          </h2>
        </div>

        {allCourses.length > 0 ? (
          // ✅ Grid with proper mobile constraints
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((course) => (
              <CourseCard key={course.id} course={course} variant="grid" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 glass-card-no-glow rounded-xl">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4 amber-glow shrink-0">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-[#F97316]" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-200 px-4">
              No courses enrolled yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mt-1 mb-6 px-4">
              Start learning today by browsing our course catalog
            </p>
            <Button className="kinetic-gradient text-white border-0 hover:opacity-90 w-full sm:w-auto px-6 mx-4 sm:mx-0">
              Browse Courses
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
