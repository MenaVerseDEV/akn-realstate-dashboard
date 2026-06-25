import { authFetch } from "@/lib/api/fetch-auth";
import {
  assignOrder,
  toApiInput,
  toSocialLink,
} from "@/lib/api/mappers/footer-social-links";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  SocialLink,
  SocialLinkApi,
  SocialLinkFormValues,
} from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function list(): Promise<SocialLink[]> {
  const response = await authorizedFetch("/footer/social-media-links", { method: "GET" });
  const items = await parseApiResponse<SocialLinkApi[]>(response);
  return assignOrder(items.map((item, index) => toSocialLink(item, index)));
}

export async function getById(id: string): Promise<SocialLink> {
  const response = await authorizedFetch(`/footer/social-media-links/${id}`, { method: "GET" });
  const item = await parseApiResponse<SocialLinkApi>(response);
  return toSocialLink(item);
}

export async function create(values: SocialLinkFormValues): Promise<SocialLink> {
  const response = await authorizedFetch("/footer/social-media-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const item = await parseApiResponse<SocialLinkApi>(response);
  return toSocialLink(item);
}

export async function update(id: string, values: SocialLinkFormValues): Promise<SocialLink> {
  const response = await authorizedFetch(`/footer/social-media-links/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const item = await parseApiResponse<SocialLinkApi>(response);
  return toSocialLink(item);
}

export async function deleteLink(id: string): Promise<void> {
  const response = await authorizedFetch(`/footer/social-media-links/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<SocialLink[]> {
  const response = await authorizedFetch("/footer/social-media-links/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
