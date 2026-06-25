import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toNavLink } from "@/lib/api/mappers/nav-bar-pages";
import { fetchMergedNavList } from "@/lib/api/nav-bff";
import {
  authorizedJsonFetch,
  getAccessToken,
  parseApiResponse,
} from "@/lib/auth/server";
import type { NavBarPageApi, NavBarPageInput } from "@/lib/types";

function unauthorized() {
  return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "فشل الطلب";
  const status = message === "غير مصرح" || message === "بيانات الدخول غير صحيحة" ? 401 : 500;
  return NextResponse.json({ message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const items = await fetchMergedNavList(accessToken);
    return NextResponse.json({ items });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const body = (await request.json()) as NavBarPageInput;
    const response = await authorizedJsonFetch(accessToken, "/nav-bar-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseApiResponse<NavBarPageApi>(response);
    return NextResponse.json({ item: toNavLink(data) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT() {
  return NextResponse.json({ message: "استخدم مسار العنصر للتحديث" }, { status: 405 });
}
