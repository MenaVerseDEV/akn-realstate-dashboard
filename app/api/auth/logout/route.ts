import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiLogout, clearAuthCookies, getAccessToken } from "@/lib/auth/server";

export async function POST(request: NextRequest) {
  const accessToken = getAccessToken(request);

  try {
    if (accessToken) {
      await apiLogout(accessToken);
    }
  } catch {
    // Clear local session even if remote logout fails
  }

  const cookieStore = await cookies();
  clearAuthCookies(cookieStore);

  return new NextResponse(null, { status: 204 });
}
