import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const roleChecker = async (role: "INSTRUCTOR" | "STUDENT" | "ADMIN") => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== role) {
    const redirectMap: Record<string, string> = {
      STUDENT: "/dashboard/student/",
      INSTRUCTOR: "/dashboard/instructor/",
      ADMIN: "/dashboard/admin",
    };
    redirect(redirectMap[session.user.role] ?? "/login");
  }
  const user = session.user;
  return user;
};
