import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AppRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

const AUTH_ROUTES = new Set(["/login", "/signup"]);
const PROTECTED_PREFIXES = ["/dashboard", "/courses/createCourse"];
const ADMIN_PREFIX = "/dashboard/admin";
const INSTRUCTOR_PREFIXES = ["/dashboard/instructor", "/courses/createCourse"];

const getDashboardByRole = (role: AppRole | undefined): string => {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "INSTRUCTOR":
      return "/dashboard/instructor";
    case "STUDENT":
    default:
      return "/dashboard/student";
  }
};

const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some((route) => pathname.startsWith(route));

const isInstructorRoute = (pathname: string): boolean =>
  INSTRUCTOR_PREFIXES.some((route) => pathname.startsWith(route));

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const role = token?.role as AppRole | undefined;
  const dashboardPath = getDashboardByRole(role);

  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  if (token && pathname.startsWith(ADMIN_PREFIX) && role !== "ADMIN") {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  if (token && isInstructorRoute(pathname) && role !== "INSTRUCTOR") {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/courses/createCourse",
    "/dashboard/instructor/:path*",
    "/dashboard/admin/:path*",
  ],
};
