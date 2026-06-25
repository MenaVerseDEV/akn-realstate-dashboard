import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiMe, getAccessToken } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const user = await apiMe(accessToken);
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل جلب الملف الشخصي";
    return NextResponse.json({ message }, { status: 401 });
  }
}
