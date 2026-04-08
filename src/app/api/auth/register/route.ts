import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { Hashpassword } from "@/services/hashService";
import { NextRequest, NextResponse } from "next/server";

type RegisterRequestBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

const INVALID_PAYLOAD_MESSAGE = "Invalid request payload.";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const payload = (await req.json()) as RegisterRequestBody;
    const parsedBody = registerSchema.safeParse({
      name: payload?.name,
      email:
        typeof payload?.email === "string"
          ? payload.email.trim().toLowerCase()
          : payload?.email,
      password: payload?.password,
      confirmPassword:
        typeof payload?.confirmPassword === "string"
          ? payload.confirmPassword
          : payload?.password,
    });

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error.issues[0]?.message ?? INVALID_PAYLOAD_MESSAGE,
        },
        { status: 400 },
      );
    }

    const { name, password } = parsedBody.data;
    const email = parsedBody.data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const encryptedPassword = await Hashpassword(password, 12);
    await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: encryptedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
