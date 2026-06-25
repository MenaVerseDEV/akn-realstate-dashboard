import type { NextRequest } from "next/server";
import { AUTH_COOKIE, REFRESH_COOKIE, type ApiSuccessResponse, type AuthResponse, type RefreshResponse, type User } from "@/lib/types";

const DEFAULT_ACCESS_MAX_AGE = 60 * 15;
const DEFAULT_REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

function decodeJwtMaxAge(token: string, fallback: number): number {
  try {
    const segment = token.split(".")[1];
    if (!segment) return fallback;
    const payload = JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (typeof payload.exp === "number") {
      return Math.max(payload.exp - Math.floor(Date.now() / 1000), 60);
    }
  } catch {
    // use fallback
  }
  return fallback;
}

export function getAccessToken(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE)?.value ?? null;
}

export function getRefreshToken(request: NextRequest): string | null {
  return request.cookies.get(REFRESH_COOKIE)?.value ?? null;
}

type CookieStore = {
  set: (
    name: string,
    value: string,
    options: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
    },
  ) => void;
  delete: (name: string) => void;
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function setAuthCookies(
  cookies: CookieStore,
  data: Pick<AuthResponse, "accessToken" | "refreshToken">,
) {
  const accessMaxAge = decodeJwtMaxAge(data.accessToken, DEFAULT_ACCESS_MAX_AGE);
  const refreshMaxAge = decodeJwtMaxAge(data.refreshToken, DEFAULT_REFRESH_MAX_AGE);

  cookies.set(AUTH_COOKIE, data.accessToken, {
    httpOnly: false,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
  });

  cookies.set(REFRESH_COOKIE, data.refreshToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAge,
  });
}

export function clearAuthCookies(cookies: CookieStore) {
  cookies.delete(AUTH_COOKIE);
  cookies.delete(REFRESH_COOKIE);
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      (response.status === 401 ? "بيانات الدخول غير صحيحة" : "فشل الطلب");
    throw new Error(message);
  }

  if (body && typeof body === "object" && "success" in body && "data" in body) {
    const wrapped = body as ApiSuccessResponse<T>;
    if (!wrapped.success) {
      throw new Error(wrapped.message || "فشل الطلب");
    }
    return wrapped.data;
  }

  return body as T;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return parseApiResponse<AuthResponse>(response);
}

export async function apiRefresh(refreshToken: string): Promise<RefreshResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  return parseApiResponse<RefreshResponse>(response);
}

export async function apiMe(accessToken: string): Promise<User> {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseApiResponse<User>(response);
}

export async function apiLogout(accessToken: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}
