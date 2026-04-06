/**
 * Course Detail Page - LearnHub
 *
 * Design: Obsidian & Amber Editorial ("The Kinetic Monolith")
 * Features:
 * - Server-side course fetching with Prisma
 * - Sticky enrollment sidebar
 * - Expandable curriculum
 * - Tabbed content (Overview, Reviews, Q&A)
 * - DESIGN.md compliant: No-Line Rule, Amber Radiance, Editorial spacing
 */

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CourseHeader } from "@/components/courses/course-header"
import { CourseSidebar } from "@/components/courses/course-sidebar"
import { CourseCurriculum } from "@/components/courses/course-curriculum"
import { CourseTabs } from "@/components/courses/course-tabs"

// ✅ REMOVED: import { auth } from "@/lib/auth" — doesn't exist yet

// Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true, description: true },
  })

  if (!course) return { title: "Course Not Found | LearnHub" }

  return {
    title: `${course.title} | LearnHub`,
    description: course.description,
  }
}

// Fetch course data - Matches your Prisma schema (chapters, not lessons)
async function getCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { name: true, image: true, bio: true } },
      // ✅ Chapters ARE the lessons in your schema
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      // ❌ REMOVED: reviews - doesn't exist in your schema yet
      // ❌ REMOVED: enrollments - not needed for public view
    },
  });

  if (!course || !course.isPublished) notFound();

  return course;
}

// ✅ TEMPORARY: Assume not enrolled (will connect to auth when ready)
// async function checkEnrollment(courseId: string) { ... }

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await getCourse(courseId)

  // ✅ TEMPORARY: Assume not enrolled
  const enrolled = false
  const progress = 0

  // ✅ Calculate stats based on CHAPTERS (your schema), not lessons
  const totalChapters = course.chapters.length
  const totalDuration = course.chapters.reduce(
    (acc, ch) => acc + (ch.videoUrl ? 15 : 5), // Estimate: 15min video, 5min reading
    0
  )

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2]">
      {/* Hero Section - Course Header */}
      <CourseHeader course={course} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Content - 70% width */}
          <section className="flex-1 min-w-0">
            {/* What You'll Learn */}
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-bold text-[#e2e2e2] mb-4">What You'll Learn</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(
                  course.learningOutcomes || [
                    "Master core concepts",
                    "Build real projects",
                    "Industry best practices",
                    "Portfolio-ready skills",
                  ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#f97316] text-lg shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-sm text-[#e0c0b1]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Curriculum */}
            <CourseCurriculum chapters={course.chapters} />

            {/* Instructor Section */}
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-6 sm:p-8 mt-8">
              <h2 className="text-xl font-bold text-[#e2e2e2] mb-6">Your Instructor</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 rounded-full bg-[#0e0e0e] overflow-hidden flex-shrink-0">
                  {course.instructor.image ? (
                    <img
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#8a8a8a] text-3xl">
                        person
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#e2e2e2] mb-1">
                    {course.instructor.name}
                  </h3>
                  <p className="text-sm text-[#f97316] mb-3">Senior Engineer & Educator</p>
                  <p className="text-sm text-[#e0c0b1]">
                    {course.instructor.bio ||
                      "Industry veteran with 10+ years of experience building scalable systems."}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs: Overview, Reviews, Q&A */}
            <CourseTabs course={course} enrolled={enrolled} />
          </section>

          {/* Right Sidebar - 30% width (sticky) */}
          <aside className="lg:w-96 flex-shrink-0">
            <CourseSidebar
              course={course}
              enrolled={enrolled}
              progress={progress}
              totalChapters={totalChapters}
              totalDuration={totalDuration}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}