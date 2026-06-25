import { toApiInput } from "@/lib/api/mappers/nav-bar-pages";
import type { NavLink, NavLinkFormValues } from "@/lib/types";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (body as { message?: string } | null)?.message ?? "فشل الطلب";
    throw new Error(message);
  }

  return body as T;
}

export async function list(): Promise<NavLink[]> {
  const response = await fetch("/api/nav-bar-pages", { method: "GET", cache: "no-store" });
  const data = await parseJsonResponse<{ items: NavLink[] }>(response);
  return data.items;
}

export async function getById(id: string): Promise<NavLink> {
  const response = await fetch(`/api/nav-bar-pages/${id}`, { method: "GET", cache: "no-store" });
  const data = await parseJsonResponse<{ item: NavLink }>(response);
  return data.item;
}

export async function create(values: NavLinkFormValues): Promise<NavLink> {
  const response = await fetch("/api/nav-bar-pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseJsonResponse<{ item: NavLink }>(response);
  return data.item;
}

export async function update(id: string, values: NavLinkFormValues): Promise<NavLink> {
  const response = await fetch(`/api/nav-bar-pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseJsonResponse<{ item: NavLink }>(response);
  return data.item;
}

export async function deleteNav(id: string): Promise<void> {
  const response = await fetch(`/api/nav-bar-pages/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseJsonResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<NavLink[]> {
  const response = await fetch("/api/nav-bar-pages/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = await parseJsonResponse<{ items: NavLink[] }>(response);
  return data.items;
}
