import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;

  try {
    // Verify ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true },
    });

    if (!chapter || chapter.course.instructorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.chapter.delete({ where: { id: chapterId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete chapter error:", error);
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;
  const body = await req.json();

  try {
    // Verify ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true },
    });

    if (!chapter || chapter.course.instructorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.isFree !== undefined && { isFree: body.isFree }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update chapter error:", error);
    return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 });
  }
}
