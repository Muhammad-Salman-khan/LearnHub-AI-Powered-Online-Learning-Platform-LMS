import { redirect } from "next/navigation";
import { getCourseById, deleteCourseById } from "@/server/action";
import InstructorNameBadge from "@/components/InstructorNameBadge";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);

  const result = await getCourseById(courseId);
  if (!result || !result.success) {
    redirect("/dashboard/instructor");
  }
  const course = result.data;
  const instructorID = course?.instructorId;

  const isInstructor = session?.user?.id === course?.instructorId;

  async function handleDelete(formData: FormData) {
    "use server";
    const courseIdToDelete = formData.get("courseId") as string;
    await deleteCourseById(courseIdToDelete);
    revalidatePath("/dashboard/instructor");
    redirect("/dashboard/instructor");
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "INTERMEDIATE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "ADVANCED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPublishedBadge = (isPublished: boolean) => {
    return isPublished ?
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
          <span className="material-symbols-outlined text-sm">
            check_circle
          </span>
          Published
        </span>
      : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Draft
        </span>;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            href="/dashboard/instructor"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </a>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <Link
            href="/dashboard/instructor/courses"
            className="hover:text-primary transition-colors"
          >
            Courses
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-foreground font-medium truncate">
            {course?.title}
          </span>
        </div>

        {/* Course Header Card */}
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
          {/* Thumbnail */}
          {course?.thumbnail ?
            <div className="relative w-full h-64 sm:h-80 overflow-hidden">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 100vw"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {getPublishedBadge(course.isPublished)}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(course.level)}`}
                  >
                    {course.level}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {course.title}
                </h1>
              </div>
            </div>
          : <div className="relative w-full h-64 sm:h-80 kinetic-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-8xl text-white/90">
                school
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {course?.isPublished &&
                    getPublishedBadge(course?.isPublished)}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${course?.level && getLevelColor(course?.level)}`}
                  >
                    {course?.level}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {course?.title}
                </h1>
              </div>
            </div>
          }

          {/* Action Buttons - Only for Instructor */}
          {isInstructor && (
            <div className="px-6 sm:px-8 py-4 border-t border-border/50 flex flex-wrap items-center gap-3">
              <a
                href={`/dashboard/instructor/courses/${courseId}/edit`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Course
              </a>
              <form action={handleDelete}>
                <input type="hidden" name="courseId" value={courseId} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive/20 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/30 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                  Delete Course
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass-card rounded-xl p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                <h2 className="text-xl font-semibold text-foreground">
                  Description
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {course?.description && course.description}
              </p>
            </div>

            {/* Chapters */}
            <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    menu_book
                  </span>
                  <h2 className="text-xl font-semibold text-foreground">
                    Course Content
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {(course?.chapters && course?.chapters?.length) || 0} chapters
                </span>
              </div>
              {course?.chapters && course?.chapters?.length > 0 ?
                <div className="space-y-3">
                  {course?.chapters
                    .sort((a, b) => a.position - b.position)
                    .map((chapter, index: number) => (
                      <div
                        key={chapter.id}
                        className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {chapter.title}
                            </h3>
                            {chapter.description && (
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {chapter.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              {chapter.videoUrl && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">
                                    videocam
                                  </span>
                                  Video
                                </span>
                              )}
                              {chapter.isFree && (
                                <span className="inline-flex items-center gap-1 text-green-400">
                                  <span className="material-symbols-outlined text-xs">
                                    lock_open
                                  </span>
                                  Free
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">
                                  {chapter.isPublished ?
                                    "visibility"
                                  : "visibility_off"}
                                </span>
                                {chapter.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              : <div className="text-center py-8 text-muted-foreground">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-50">
                    folder_open
                  </span>
                  <p>No chapters added yet</p>
                </div>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-300">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Course Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-sm">
                      category
                    </span>
                    <span className="text-sm">Category</span>
                  </div>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {course?.category && course.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-sm">
                      trending_up
                    </span>
                    <span className="text-sm">Level</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {course?.level && course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-sm">
                      payments
                    </span>
                    <span className="text-sm">Price</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {course?.price === 0 ? "Free" : `Rs. ${course?.price}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-sm">
                      star
                    </span>
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {course?.rating || "No ratings yet"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    <span className="text-sm">Created</span>
                  </div>
                  <span className="text-sm text-foreground">
                    {course?.createdAt &&
                      new Date(course?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-400">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  Instructor
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {(course?.instructorId &&
                    course?.instructorId?.charAt(0).toUpperCase()) ||
                    "I"}
                </div>
                {/* add instructor name here  */}
                <InstructorNameBadge instructorId={instructorID} />
                {/* end instructor name here  */}
              </div>
            </div>

            {/* Not Instructor Message */}
            {!isInstructor && session && (
              <div className="glass-card-no-glow rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">
                    info
                  </span>
                  <div>
                    <h4 className="font-medium text-foreground">View Only</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You are viewing this course as a student. Only the
                      instructor can edit or delete this course.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
