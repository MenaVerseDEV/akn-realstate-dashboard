import { AUTH_COOKIE } from "@/lib/types";
import * as session from "@/lib/auth/session";

function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessTokenFromCookie();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(path, { ...init, headers });

  if (response.status === 401) {
    try {
      await session.refresh();
      const refreshedToken = getAccessTokenFromCookie();
      if (refreshedToken) {
        headers.set("Authorization", `Bearer ${refreshedToken}`);
      }
      response = await fetch(path, { ...init, headers });
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
      throw new Error("انتهت الجلسة");
    }
  }

  return response;
}
