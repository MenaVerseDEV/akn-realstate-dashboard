import { authFetch } from "@/lib/api/fetch-auth";
import {
  mergeNavLists,
  toApiInput,
  toNavLink,
} from "@/lib/api/mappers/nav-bar-pages";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { NavBarPageApi, NavLink, NavLinkFormValues } from "@/lib/types";

async function authorizedFetch(
  path: string,
  init: RequestInit = {},
  acceptLanguage?: string,
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (acceptLanguage) {
    headers.set("Accept-Language", acceptLanguage);
  }
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function list(): Promise<NavLink[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/nav-bar-pages", { method: "GET" }, "ar"),
    authorizedFetch("/nav-bar-pages", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<NavBarPageApi[]>(arResponse),
    parseApiResponse<NavBarPageApi[]>(enResponse),
  ]);

  return mergeNavLists(arItems, enItems);
}

export async function getById(id: string): Promise<NavLink> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/nav-bar-pages/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/nav-bar-pages/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<NavBarPageApi>(arResponse),
    parseApiResponse<NavBarPageApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  return toNavLink(arItem, titleEn);
}

export async function create(values: NavLinkFormValues): Promise<NavLink> {
  const response = await authorizedFetch("/nav-bar-pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<NavBarPageApi>(response);
  return toNavLink(data);
}

export async function update(id: string, values: NavLinkFormValues): Promise<NavLink> {
  const response = await authorizedFetch(`/nav-bar-pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<NavBarPageApi>(response);
  return toNavLink(data);
}

export async function deleteNav(id: string): Promise<void> {
  const response = await authorizedFetch(`/nav-bar-pages/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<NavLink[]> {
  const response = await authorizedFetch("/nav-bar-pages/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
