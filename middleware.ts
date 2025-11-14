import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin-token");

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAdmin = req.nextUrl.pathname.startsWith("/api/admin");

  if ((isAdminRoute || isApiAdmin) && !token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
