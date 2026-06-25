import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/types";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Access token cookie set by /api/auth/login (readable); refresh is httpOnly
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isLogin = pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  if (!isAdmin) return NextResponse.next();

  if (!token && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (token && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
