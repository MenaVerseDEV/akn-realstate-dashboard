import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchMergedNavList } from "@/lib/api/nav-bff";
import { authorizedJsonFetch, getAccessToken, parseApiResponse } from "@/lib/auth/server";

function unauthorized() {
  return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "فشل الطلب";
  const status = message === "غير مصرح" || message === "بيانات الدخول غير صحيحة" ? 401 : 500;
  return NextResponse.json({ message }, { status });
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const body = (await request.json()) as { ids?: string[] };

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json({ message: "قائمة المعرفات مطلوبة" }, { status: 400 });
    }

    const response = await authorizedJsonFetch(accessToken, "/nav-bar-pages/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: body.ids }),
    });

    await parseApiResponse<unknown>(response);
    const items = await fetchMergedNavList(accessToken);

    return NextResponse.json({ items });
  } catch (error) {
    return handleError(error);
  }
}
