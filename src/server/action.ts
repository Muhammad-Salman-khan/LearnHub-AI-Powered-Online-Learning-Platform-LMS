"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";
import { CourseInput, courseSchema } from "@/lib/validations";
import { UploadCourseThumbnail } from "@/services/UploadFile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
type ActionResponse =
  | { success: true; message: string }
  | { success: false; error: any };

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
    return { success: true, message: "Course Created Succssfully" };
  } catch (error) {
    console.error(`got error`, error);
    return { success: false, error: "something went wrong" };
  }
};
