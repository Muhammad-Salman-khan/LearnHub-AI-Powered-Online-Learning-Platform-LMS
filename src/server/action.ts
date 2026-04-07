"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import {
  ChapterInput,
  chapterSchema,
  CourseInput,
  courseSchema,
} from "@/lib/validations";
import { UploadCourseThumbnail } from "@/services/UploadFile";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
type ActionResponse =
  | { success: true; message: string }
  | { success: false; error: any };
// create Course For students (Start!)
export const CreateCourse = async (
  data: CourseInput,
): Promise<ActionResponse> => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student/");
  try {
    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: valid?.error?.flatten() || `something not working`,
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
        instructorId: session.user.id,
      },
    });
    revalidatePath("/courses");
    return {
      success: true,
      message: "Course Created Succssfully",
    };
  } catch (error) {
    console.error(`got error`, error);
    return { success: false, error: "something went wrong" };
  }
};
// create Course For students (end!)

// Get Course By id (Start!)
export const getCourseById = async (id: string) => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  try {
    if (!id) return notFound();
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
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student/");

  if (!id) return notFound();
  try {
    const FindPost = await prisma.course.deleteMany({
      where: { id: id, instructorId: session?.user.id },
    });
    if (FindPost.count === 0) {
      return { success: false, error: "404 Course not found" };
    }
    revalidatePath("/courses/");
    return {
      success: true,
      message: `Course Deleted Succssfully`,
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: "something went wrong" };
  }
};

// update Course By id' (start!)
export const courseUpdateFields = async (id: string, data: CourseInput) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") {
    redirect("/dashboard/student/");
  }
  if (!id) return notFound();
  try {
    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: valid?.error?.flatten() || `something not working`,
      };
    }
    const { title, description, price, isPublished, category, level } =
      valid.data;
    const FindPost = await prisma.course.updateMany({
      where: { id: id, instructorId: session?.user.id },
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
      message: "course updated Succssfully!",
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
        error: `No Id found `,
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
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student/");
  try {
    const InstructorCourses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
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
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
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
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/student`);
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
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "INSTRUCTOR") redirect(`/dashboard/student`);
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
      where: { id: CourseId, instructorId: session.user.id },
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
