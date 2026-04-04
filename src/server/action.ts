"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { CourseInput, courseSchema } from "@/lib/validations";
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
  try {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");
    if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student/");
    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: valid.error?.cause || `something not working`,
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
  try {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

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
  try {
    const session = await getServerSession(authOptions);

    if (!id) return notFound();
    if (!session) redirect("/login");
    if (session.user.role !== "INSTRUCTOR") redirect("/dashboard/student/");
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
  try {
    const session = await getServerSession(authOptions);

    if (!id) return notFound();

    const valid = courseSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false,
        error: valid.error?.cause || `something not working`,
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
    if (!FindPost) return { success: false, error: "404 Course not found" };
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
