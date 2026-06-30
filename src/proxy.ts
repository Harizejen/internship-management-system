import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Next.js 16 Named Proxy Hook integration with Auth.js
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === "/";
  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. Allow all internal Auth.js system routes to pass unconditionally
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Handle redirection rules for login / registration landing fields
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Block unauthenticated anomalies from breaking into dashboard paths
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 4. Role-Based Access Control Boundaries (Identity Gates)
  if (isLoggedIn && nextUrl.pathname.startsWith("/dashboard")) {
    if (
      nextUrl.pathname.startsWith("/dashboard/admin") &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

// Structural routing rules configuration matrix
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
