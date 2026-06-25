import type { AuthResponse, User } from "@/lib/types";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (body as { message?: string } | null)?.message ?? "فشل الطلب";
    throw new Error(message);
  }

  return body as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonResponse<{ user: User }>(response);
  return { user: data.user, accessToken: "", refreshToken: "" };
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", { method: "POST" });

  if (!response.ok && response.status !== 204) {
    await parseJsonResponse<unknown>(response);
  }
}

export async function me(): Promise<User> {
  const response = await fetch("/api/auth/me", { method: "GET" });
  const data = await parseJsonResponse<{ user: User }>(response);
  return data.user;
}

export async function refresh(): Promise<User> {
  const response = await fetch("/api/auth/refresh", { method: "POST" });
  const data = await parseJsonResponse<{ user: User }>(response);
  return data.user;
}
