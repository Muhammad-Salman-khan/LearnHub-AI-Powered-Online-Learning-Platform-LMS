"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  ChapterInput,
  chapterSchema,
  CourseInput,
  courseSchema,
  SearchInput,
  searchSchema,
} from "@/lib/validations";
import { roleChecker } from "@/services/authCheckers";
import { UploadCourseThumbnail } from "@/services/UploadFile";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
type ActionResponse =
  | { success: true; message: string }
  | { success: false; error: string };
// create Course For students (Start!)
export const CreateCourse = async (
  data: CourseInput,
): Promise<ActionResponse> => {
  const user = await roleChecker("INSTRUCTOR");
  try {
    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: `something went wrong`,
      };
    }
    const {
      title,
      description,
      thumbnail,
      price,
      category,
      level,
      isPublished,
    } = valid.data;

    const Thumb = thumbnail ? await UploadCourseThumbnail(thumbnail) : null;

    await prisma.course.create({
      data: {
        title,
        description,
        thumbnail: Thumb,
        price,
        category,
        level,
        isPublished,
        instructorId: user.id,
      },
    });
    revalidatePath("/courses");
    return {
      success: true,
      message: "Course Created Successfully",
    };
  } catch (error) {
    console.error(`got error`, error);
    return { success: false, error: "something went wrong" };
  }
};
// create Course For students (end!)

// Get Course By id (Start!)
export const getCourseById = async (id: string) => {
  if (!id) return notFound();
  try {
    const FindPost = await prisma.course.findUnique({
      where: { id: id },
      include: {
        instructor: { select: { name: true, image: true, bio: true } },
        chapters: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
        },
      },
    });
    if (!FindPost) return { success: false, error: "404 Course not found" };
    return { success: true, data: FindPost };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};
// Get Course By id (End!)

// delete course by id
export const deleteCourseById = async (id: string) => {
  const user = await roleChecker("INSTRUCTOR");
  if (!id) return notFound();
  try {
    const FindPost = await prisma.course.deleteMany({
      where: { id: id, instructorId: user.id },
    });
    if (FindPost.count === 0) {
      return { success: false, error: "404 Course not found" };
    }
    revalidatePath("/courses/");
    return {
      success: true,
      message: `Course Deleted Successfully`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};

// update Course By id' (start!)
export const courseUpdateFields = async (id: string, data: CourseInput) => {
  const user = await roleChecker("INSTRUCTOR");

  if (!id) return notFound();
  try {
    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: `something went wrong`,
      };
    }
    const { title, description, price, isPublished, category, level } =
      valid.data;
    const FindPost = await prisma.course.updateMany({
      where: { id: id, instructorId: user.id },
      data: {
        title,
        description,
        price,
        isPublished,
        category,
        level,
      },
    });
    if (FindPost.count === 0)
      return { success: false, error: "Course not found" };
    revalidatePath("/courses/");
    return {
      success: true,
      message: "course updated Successfully!",
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};
// update Course By id' (end!)

// Get Instructor Id
export const getInstructorId = async (Id: string) => {
  try {
    if (!Id) {
      return {
        success: false,
        error: `No Id found`,
      };
    }
    const InstructorId = await prisma.user.findUnique({
      where: { id: Id, role: "INSTRUCTOR" },
    });
    if (!InstructorId) {
      return {
        success: false,
        error: `Instructor not Found`,
      };
    }
    return {
      success: true,
      data: InstructorId,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Get Instructor Id End

// GetAllUsers (start!)
export const getAllUsers = async (page = 1, pageSize = 20) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count(),
    ]);

    if (data.length === 0) {
      return { success: false, error: `No users found` };
    }
    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};
// GetAllUsers (end!)

// GetAllCourses (Start!)
export const getAllCourses = async (page = 1, pageSize = 20) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.course.count({ where: { isPublished: true } }),
    ]);
    if (data.length === 0) {
      return { success: false, error: `No courses found` };
    }
    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
export const getAllCoursesForAdminDashboard = async (page = 1, pageSize = 20) => {
  const admin = await roleChecker("ADMIN");
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.course.count(),
    ]);
    if (data.length === 0) {
      return { success: false, error: `No courses found` };
    }
    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// GetAllCourses (end!)

//  get Course By Instructor
export const getCourseByInstructor = async (page = 1, pageSize = 20) => {
  const user = await roleChecker("INSTRUCTOR");
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: user.id },
        include: {
          _count: {
            select: { enrollments: true },
          },
        },
        skip,
        take: pageSize,
      }),
      prisma.course.count({ where: { instructorId: user.id } }),
    ]);

    if (data.length === 0)
      return { success: false, error: `No courses found` };

    return {
      success: true,
      data: {
        items: data.map((course) => ({
          ...course,
          students: course._count.enrollments,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};
// End InstructorCourses

// Find userByName (start!)
export const findUserByName = async (name: string) => {
  const user = await roleChecker("STUDENT");
  try {
    const searchedUser = await prisma.user.findMany({
      where: { name: name },
    });
    if (searchedUser.length === 0) {
      return {
        success: false,
        error: `No User found`,
      };
    }
    return {
      success: true,
      data: searchedUser,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// all Instructor's
export const getAllInstructors = async (page = 1, pageSize = 20) => {
  const admin = await roleChecker("ADMIN");
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "INSTRUCTOR" },
        include: {
          courses: {
            where: { isPublished: true },
            orderBy: { rating: "desc" },
          },
        },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    ]);
    if (data.length === 0) {
      return { success: false, error: `No instructors found` };
    }
    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};

// Get all instructors (public - no auth required)
export const getAllInstructorsPublic = async (page = 1, pageSize = 100) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "INSTRUCTOR" },
        include: {
          courses: {
            where: { isPublished: true },
            orderBy: { rating: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    ]);
    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Get all the instructor (end!)

// create Chapter  inside Course (Start!)
export const CreateChapters = async (CourseId: string, data: ChapterInput) => {
  const user = await roleChecker("INSTRUCTOR");
  try {
    const valid = chapterSchema.safeParse(data);
    if (!valid?.success) {
      return {
        success: false,
        error: "validation error",
      };
    }
    const {
      title,
      description,
      videoUrl,
      position,
      isFree,
      isPublished,
      content,
    } = valid.data;
    const checkInstructorId = await prisma.course.findFirst({
      where: { id: CourseId, instructorId: user.id },
      select: { id: true },
    });
    if (!checkInstructorId) return { success: false, message: "access denied" };
    const createdData = await prisma.chapter.create({
      data: {
        title,
        description,
        videoUrl,
        position,
        content,
        isFree,
        isPublished,
        courseId: CourseId,
      },
    });
    if (!createdData) {
      return {
        success: false,
        error: `Failed to create chapter`,
      };
    }
    revalidatePath("/courses/");
    return {
      success: true,
      data: createdData,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// create Chapter  inside Course (end!)

// update from student to Instructor (admin function!!) (start!)
export const roleChangerAdminLevel = async (
  userId: string,
  role: "INSTRUCTOR" | "STUDENT" | "ADMIN",
) => {
  const admin = await roleChecker("ADMIN");
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: "User doesn't exists" };
    }
    if (user.role === role) {
      return { success: false, error: `User already has ${role}` };
    }
    const changedRole = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/dashboard/admin/users");
    return {
      success: true,
      message: `user role updated Succssfully`,
      data: changedRole,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// update from student to Instructor (admin function!!) (start!)

// find course by title or description (start!)
export const getSearchedCourses = async (params: { query?: string; category?: string; level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number }) => {
  const { query, category, level, minPrice, maxPrice, page = 1, pageSize = 10 } = params;

  try {
    const validated = searchSchema.safeParse({ query, category, level, minPrice, maxPrice });
    if (!validated.success) {
      return { success: false, error: "Invalid search parameters" };
    }

    const where: Prisma.CourseWhereInput = {
      isPublished: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (level) where.level = level;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { instructor: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.course.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// find course by title or description (end!)

// ─────────────────────────────────────────────────────────────
// ENROLLMENT & PROGRESS ACTIONS
// ─────────────────────────────────────────────────────────────

// Enroll user in a course (start!)
export const enrollInCourse = async (courseId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }
    if (session.user.role !== "STUDENT") {
      return { success: false, error: "Only students can enroll" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });
    if (!course) return { success: false, error: "Course not found" };

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) return { success: false, error: "Already enrolled" };

    await prisma.enrollment.create({
      data: { userId: session.user.id, courseId },
    });
    revalidatePath("/dashboard/student");
    return { success: true, message: "Enrolled successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Enroll user in a course (end!)

// Get enrolled courses for a user (start!)
export const getEnrolledCourses = async (userId: string, page = 1, pageSize = 20) => {
  try {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              instructor: { select: { name: true } },
              _count: { select: { chapters: true } },
            },
          },
          user: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.enrollment.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: {
        items: items.map((e) => ({
          ...e.course,
          enrolledAt: e.createdAt,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Get enrolled courses for a user (end!)

// Mark chapter as complete (start!)
export const markChapterComplete = async (chapterId: string) => {
  const user = await roleChecker("STUDENT");
  try {
    await prisma.progress.upsert({
      where: { userId_chapterId: { userId: user.id, chapterId } },
      update: { isCompleted: true },
      create: { userId: user.id, chapterId, isCompleted: true },
    });
    revalidatePath("/courses");
    return { success: true, message: "Chapter marked as complete" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Mark chapter as complete (end!)

// Get chapter progress (start!)
export const getChapterProgress = async (userId: string, chapterIds: string[]) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId, chapterId: { in: chapterIds } },
      select: { chapterId: true, isCompleted: true },
    });
    const progressMap = new Map(progress.map((p) => [p.chapterId, p.isCompleted]));
    return { success: true, data: progressMap };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Get chapter progress (end!)

// Get course progress summary (start!)
export const getCourseProgress = async (userId: string, courseId: string) => {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });
    const chapterIds = chapters.map((c) => c.id);
    const completed = await prisma.progress.count({
      where: { userId, chapterId: { in: chapterIds }, isCompleted: true },
    });
    const total = chapters.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      success: true,
      data: { completed, total, percentage, chapterIds },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// Get course progress summary (end!)

// ─────────────────────────────────────────────────────────────
// ADMIN COURSE MANAGEMENT ACTIONS
// ─────────────────────────────────────────────────────────────

// Unpublish/Publish a course (Admin only)
export const toggleCoursePublish = async (courseId: string) => {
  const admin = await roleChecker("ADMIN");
  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return { success: false, error: "Course not found" };

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !course.isPublished },
    });

    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/courses");
    return {
      success: true,
      message: updated.isPublished ? "Course published" : "Course unpublished",
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};

// Delete a course (Admin only - no ownership check)
export const deleteCourseByAdmin = async (courseId: string) => {
  const admin = await roleChecker("ADMIN");
  try {
    // Delete related progress records
    await prisma.progress.deleteMany({
      where: {
        chapter: {
          courseId,
        },
      },
    });

    // Delete related chapters
    await prisma.chapter.deleteMany({
      where: { courseId },
    });

    // Delete related enrollments
    await prisma.enrollment.deleteMany({
      where: { courseId },
    });

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/courses");
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};

// Get all courses with enrollment counts (Admin only)
export const getAllCoursesWithEnrollments = async (page = 1, pageSize = 100) => {
  const admin = await roleChecker("ADMIN");
  try {
    const skip = (page - 1) * pageSize;
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        include: {
          _count: {
            select: { enrollments: true },
          },
          instructor: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.course.count(),
    ]);

    return {
      success: true,
      data: {
        items: courses.map((course) => ({
          ...course,
          students: course._count.enrollments,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
