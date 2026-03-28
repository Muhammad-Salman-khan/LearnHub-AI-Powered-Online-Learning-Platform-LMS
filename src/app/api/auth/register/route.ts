import { prisma } from "@/lib/prisma";
import { Hashpassword } from "@/services/hashService";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return NextResponse.json(
        {
          message: "User with a email already exists",
        },
        { status: 401 },
      );
    }
    const encryptedPassword = await Hashpassword(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        // password: encryptedPassword,
      },
    });
    if (!newUser) {
      return NextResponse.json(
        {
          message: "something went wrong",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error,
      },
      {},
    );
  }
};
