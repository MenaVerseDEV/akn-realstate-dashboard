import type { ApiSuccessResponse } from "@/lib/types";

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

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
