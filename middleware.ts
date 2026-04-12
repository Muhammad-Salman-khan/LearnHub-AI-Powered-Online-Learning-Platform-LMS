import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AppRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

const AUTH_ROUTES = new Set(["/login", "/signup"]);
const PROTECTED_PREFIXES = ["/dashboard", "/courses/createCourse"];
const ADMIN_PREFIX = "/dashboard/admin";
const INSTRUCTOR_PREFIXES = ["/dashboard/instructor", "/courses/createCourse"];
const STUDENT_PREFIX = "/dashboard/student";

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

const isAdminRoute = (pathname: string): boolean =>
  pathname.startsWith(ADMIN_PREFIX);

const isStudentRoute = (pathname: string): boolean =>
  pathname.startsWith(STUDENT_PREFIX);

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const role = token?.role as AppRole | undefined;
  const dashboardPath = getDashboardByRole(role);

  // 1. Unauthenticated users trying to access protected routes
  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users visiting auth routes redirect to their dashboard
  if (token && AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // 3. Role-based route protection - redirect to correct dashboard
  if (token) {
    // Non-admin trying to access admin routes
    if (isAdminRoute(pathname) && role !== "ADMIN") {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Non-instructor trying to access instructor routes
    if (isInstructorRoute(pathname) && role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Non-student trying to access student routes
    if (isStudentRoute(pathname) && role !== "STUDENT") {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Admin trying to access student or instructor routes
    if (role === "ADMIN" && (isStudentRoute(pathname) || isInstructorRoute(pathname))) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Instructor trying to access admin or student routes
    if (role === "INSTRUCTOR" && (isAdminRoute(pathname) || isStudentRoute(pathname))) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Student trying to access admin or instructor routes
    if (role === "STUDENT" && (isAdminRoute(pathname) || isInstructorRoute(pathname))) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/courses/createCourse",
  ],
};
