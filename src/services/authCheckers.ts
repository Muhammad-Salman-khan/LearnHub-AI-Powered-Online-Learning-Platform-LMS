import { Role } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

const dashboardRedirects: Record<Role, string> = {
  STUDENT: "/dashboard/student",
  INSTRUCTOR: "/dashboard/instructor",
  ADMIN: "/dashboard/admin",
};

export const roleChecker = async (
  role: Role,
): Promise<Session["user"]> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== role) {
    redirect(dashboardRedirects[session.user.role] ?? "/login");
  }

  return session.user;
};
