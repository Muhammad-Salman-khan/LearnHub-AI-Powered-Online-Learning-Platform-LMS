import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
const PUBLIC_ROUTES = ["/", "/signup", "/login"];
const AUTH_CHECK = ["/signup", "/login"];
const STUDENT_ROUTES = ["/dashboard/student", "/courses"];
const INSTRUCTOR_ROUTES = ["/dashboard/instructor", "/settings"];

// This is a public route it will only allow public route only trigger redirct if user is loggedIn
function isPublicRoutes(pathname: string) {
  return PUBLIC_ROUTES.some((currentRoute) => pathname === currentRoute);
}
function isAuth(pathname: string) {
  return AUTH_CHECK.some((currentRoute) => pathname.startsWith(currentRoute));
}
function isStudentRoute(pathname: string) {
  return STUDENT_ROUTES.some((route) => pathname.startsWith(route));
}
function isInstructorRoute(pathname: string) {
  return INSTRUCTOR_ROUTES.some((route) => pathname.startsWith(route));
}

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  if (!isLoggedIn) {
    if (!isPublicRoutes(pathname)) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    return NextResponse.next();
  }
  if (isAuth(pathname)) {
    if (role === "instructor") {
      return NextResponse.redirect(
        new URL("/dashboard/instructor", request.url),
      );
    }
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }
  if (isInstructorRoute(pathname) && role !== "instructor") {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }
  if (isStudentRoute(pathname) && role === "instructor") {
    return NextResponse.redirect(new URL("/dashboard/instructor", request.url));
  }
  return NextResponse.next();
}
// these files are the file/folder where this file wont work
export const config = {
  matcher: ["/about"],
};
