"use server";
import { prisma } from "@/lib/prisma";
import {
  ChapterInput,
  chapterSchema,
  CourseInput,
  courseSchema,
} from "@/lib/validations";
import { roleChecker } from "@/services/authCheckers";
import { UploadCourseThumbnail } from "@/services/UploadFile";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
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
    });
    if (!FindPost) return { success: false, error: "404 Course not found" };
    return { success: true, data: FindPost };
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
export const getAllUsers = async () => {
  try {
    const allTheUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (allTheUsers.length === 0) {
      return {
        success: false,
        error: `No user's found`,
      };
    }
    return {
      success: true,
      data: allTheUsers,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};
// GetAllUsers (end!)

// GetAllCourses (Start!)
export const getAllCourses = async () => {
  try {
    const allCourse = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (allCourse.length === 0) {
      return {
        success: false,
        error: `No Course's found`,
      };
    }
    return {
      success: true,
      data: allCourse,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
export const getAllCoursesForAdminDashboard = async () => {
  const admin = await roleChecker("ADMIN");
  try {
    const allCourse = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (allCourse.length === 0) {
      return {
        success: false,
        error: `No Course's found`,
      };
    }
    return {
      success: true,
      data: allCourse,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// GetAllCourses (end!)

//  get Course By Instructor
export const getCourseByInstructor = async () => {
  const user = await roleChecker("INSTRUCTOR");
  try {
    const InstructorCourses = await prisma.course.findMany({
      where: { instructorId: user.id },
    });

    if (InstructorCourses.length === 0)
      return { success: false, error: `No Course's found` };

    return {
      success: true,
      data: InstructorCourses,
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
export const getAllInstructors = async () => {
  const admin = await roleChecker("ADMIN");
  try {
    const AllInstructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
    });
    if (AllInstructors.length === 0) {
      return {
        success: false,
        error: `No Instructor found`,
      };
    }
    return {
      success: true,
      data: AllInstructors,
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
export const getSearchedCourses = async (query: string) => {
  try {
    if (!query) return { success: false, error: "No search query provided" };
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    if (courses.length === 0) {
      return { success: false, error: "course not found" };
    }
    return { success: true, data: courses };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
};
// find course by title or description (end!)
