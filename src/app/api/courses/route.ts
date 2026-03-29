import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: User ID missing in session" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { title, description, category, price, chapters } = body;
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price) || 0,
        instructorId: session.user.id,
        chapters: {
          create: chapters?.map((ch: any, index: number) => ({
            title: ch.title,
            position: index + 1,
            isPublished: true,
          })),
        },
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error("PRISMA_CREATE_ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
