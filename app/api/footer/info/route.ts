import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toFooterInfo } from "@/lib/api/mappers/footer-info";
import {
  authorizedJsonFetch,
  getAccessToken,
  parseApiResponse,
} from "@/lib/auth/server";
import type { FooterInfoApi } from "@/lib/types";

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

    const response = await authorizedJsonFetch(accessToken, "/footer/info", {
      method: "GET",
    });

    const data = await parseApiResponse<FooterInfoApi>(response);
    return NextResponse.json({ info: toFooterInfo(data) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const formData = await request.formData();
    const upstream = new FormData();

    for (const key of ["websiteName", "websiteDescription", "address", "phone", "email"] as const) {
      const value = formData.get(key);
      if (typeof value === "string") {
        upstream.append(key, value);
      }
    }

    const logo = formData.get("logo");
    if (logo instanceof File && logo.size > 0) {
      upstream.append("logo", logo, logo.name);
    }

    const response = await authorizedJsonFetch(accessToken, "/footer/info", {
      method: "PUT",
      body: upstream,
    });

    const data = await parseApiResponse<FooterInfoApi>(response);
    return NextResponse.json({ info: toFooterInfo(data) });
  } catch (error) {
    return handleError(error);
  }
}
