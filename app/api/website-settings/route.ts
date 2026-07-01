import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toSiteSettings } from "@/lib/api/mappers/website-settings";
import { getAccessToken, getApiBaseUrl, parseApiResponse } from "@/lib/auth/server";
import { DEFAULT_LANGUAGES, type WebsiteSettingsApi } from "@/lib/types";

async function forwardGet(accessToken: string) {
  const response = await fetch(`${getApiBaseUrl()}/website-settings`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await parseApiResponse<WebsiteSettingsApi>(response);
  return NextResponse.json({ settings: toSiteSettings(data) });
}

async function forwardPut(accessToken: string, formData: FormData) {
  const upstream = new FormData();

  const websiteName = formData.get("websiteName");
  const defaultLanguage = formData.get("defaultLanguage");
  const mapLink = formData.get("mapLink");
  const logo = formData.get("logo");

  if (typeof websiteName === "string") {
    upstream.append("websiteName", websiteName);
  }
  if (typeof defaultLanguage === "string") {
    if (!(DEFAULT_LANGUAGES as readonly string[]).includes(defaultLanguage)) {
      return NextResponse.json({ message: "اللغة الافتراضية غير صالحة" }, { status: 400 });
    }
    upstream.append("defaultLanguage", defaultLanguage);
  }
  if (typeof mapLink === "string") {
    upstream.append("mapLink", mapLink);
  }
  if (logo instanceof File && logo.size > 0) {
    upstream.append("logo", logo, logo.name);
  }

  const response = await fetch(`${getApiBaseUrl()}/website-settings`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: upstream,
  });

  const data = await parseApiResponse<WebsiteSettingsApi>(response);
  return NextResponse.json({ settings: toSiteSettings(data) });
}

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
    return await forwardGet(accessToken);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) return unauthorized();

    const formData = await request.formData();
    return await forwardPut(accessToken, formData);
  } catch (error) {
    return handleError(error);
  }
}
