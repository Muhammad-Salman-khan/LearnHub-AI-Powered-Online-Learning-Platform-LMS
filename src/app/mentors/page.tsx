import Header from "@/components/themeProvider/Header/page";
import Image from "next/image";
import Link from "next/link";
import { getAllInstructorsPublic } from "@/server/action";

export default async function MentorsPage() {
  const response = await getAllInstructorsPublic(1, 100);
  const instructors = (response.success && response.data ? response.data.items : []) ?? [];

  // Sort by rating (highest first)
  const sortedInstructors = instructors.sort((a: any, b: any) => (b.courses?.reduce((sum: number, c: any) => sum + c.rating, 0) / Math.max(b.courses?.length || 1, 1)) - (a.courses?.reduce((sum: number, c: any) => sum + c.rating, 0) / Math.max(a.courses?.length || 1, 1)));

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Learn from the <span className="text-[#f97316] text-glow">Best</span>
          </h1>
          <p className="text-lg text-[#e0c0b1] max-w-2xl mx-auto">
            Industry experts with real-world experience, ready to guide your learning journey.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {sortedInstructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedInstructors.map((instructor: any) => {
                const avgRating = instructor.courses?.length > 0
                  ? (instructor.courses.reduce((sum: number, c: any) => sum + c.rating, 0) / instructor.courses.length).toFixed(1)
                  : "N/A";
                
                return (
                  <div
                    key={instructor.id}
                    className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all p-6"
                  >
                    {/* Instructor Profile */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-[#1b1b1b] overflow-hidden flex-shrink-0 border-2 border-[#f97316]/30">
                        {instructor.image ? (
                          <Image
                            src={instructor.image}
                            alt={instructor.name || "Instructor"}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#f97316]/20 to-[#1b1b1b] flex items-center justify-center">
                            <span className="text-[#f97316] text-3xl font-bold">
                              {(instructor.name || "I").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-lg text-[#e2e2e2] truncate">
                          {instructor.name || "Unknown Instructor"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-[#f97316] text-sm">
                            star
                          </span>
                          <span className="text-sm text-[#f97316] font-medium">
                            {avgRating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({instructor.courses?.length || 0} courses)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {instructor.bio && (
                      <p className="text-sm text-[#e0c0b1] mb-6 line-clamp-3">
                        {instructor.bio}
                      </p>
                    )}

                    {/* Courses */}
                    {instructor.courses && instructor.courses.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
                          Courses
                        </h4>
                        <div className="space-y-2">
                          {instructor.courses.slice(0, 3).map((course: any) => (
                            <Link
                              key={course.id}
                              href={`/courses/${course.id}`}
                              className="block p-3 rounded-lg bg-[#1b1b1b]/50 hover:bg-[#1b1b1b] border border-border/30 hover:border-primary/30 transition-all group"
                            >
                              <div className="flex items-start gap-3">
                                {course.thumbnail ? (
                                  <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    width={48}
                                    height={48}
                                    className="rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded bg-gradient-to-br from-[#f97316]/20 to-[#1b1b1b] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#f97316] text-sm font-bold">
                                      {course.title.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-[#e2e2e2] truncate group-hover:text-[#f97316] transition-colors">
                                    {course.title}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="material-symbols-outlined text-[#f97316] text-xs">
                                      star
                                    </span>
                                    <span className="text-xs text-[#f97316]">
                                      {course.rating.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      • {course.level}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {instructor.courses.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +{instructor.courses.length - 3} more courses
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 glass-card-no-glow rounded-xl">
              <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4">
                person
              </span>
              <h3 className="text-xl font-semibold text-[#e2e2e2] mb-2">
                No instructors available yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for expert instructors.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
