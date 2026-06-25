import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toNavLink } from "@/lib/api/mappers/nav-bar-pages";
import { fetchNavById } from "@/lib/api/nav-bff";
import {
  authorizedJsonFetch,
  getAccessToken,
  parseApiResponse,
} from "@/lib/auth/server";
import type { NavBarPageApi, NavBarPageInput } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function unauthorized() {
  return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "فشل الطلب";
  const status = message === "غير مصرح" || message === "بيانات الدخول غير صحيحة" ? 401 : 500;
  return NextResponse.json({ message }, { status });
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const { id } = await context.params;
    const item = await fetchNavById(accessToken, id);
    return NextResponse.json({ item });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const { id } = await context.params;
    const body = (await request.json()) as NavBarPageInput;

    const response = await authorizedJsonFetch(accessToken, `/nav-bar-pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseApiResponse<NavBarPageApi>(response);
    return NextResponse.json({ item: toNavLink(data) });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const { id } = await context.params;
    const response = await authorizedJsonFetch(accessToken, `/nav-bar-pages/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
      await parseApiResponse<unknown>(response);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
