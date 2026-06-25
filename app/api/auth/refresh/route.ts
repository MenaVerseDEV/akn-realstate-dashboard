import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiRefresh, clearAuthCookies, getRefreshToken, setAuthCookies } from "@/lib/auth/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = getRefreshToken(request);

    if (!refreshToken) {
      return NextResponse.json({ message: "جلسة منتهية" }, { status: 401 });
    }

    const data = await apiRefresh(refreshToken);
    const cookieStore = await cookies();
    setAuthCookies(cookieStore, data);

    return NextResponse.json({ user: data.user });
  } catch (error) {
    const cookieStore = await cookies();
    clearAuthCookies(cookieStore);

    const message = error instanceof Error ? error.message : "فشل تجديد الجلسة";
    return NextResponse.json({ message }, { status: 401 });
  }
}
