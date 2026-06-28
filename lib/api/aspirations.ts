import { authFetch } from "@/lib/api/fetch-auth";
import {
  mergeAspirationLists,
  toApiInput,
  toMilestone,
} from "@/lib/api/mappers/aspirations";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { AspirationApi, Milestone, MilestoneFormValues } from "@/lib/types";

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

export async function list(): Promise<Milestone[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/home/aspirations", { method: "GET" }, "ar"),
    authorizedFetch("/home/aspirations", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<AspirationApi[]>(arResponse),
    parseApiResponse<AspirationApi[]>(enResponse),
  ]);

  return mergeAspirationLists(arItems, enItems);
}

export async function getById(id: string): Promise<Milestone> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/home/aspirations/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/home/aspirations/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<AspirationApi>(arResponse),
    parseApiResponse<AspirationApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  const descriptionEn =
    typeof enItem.description === "string" ? enItem.description : enItem.description.en;

  return toMilestone(arItem, titleEn, descriptionEn);
}

export async function create(values: MilestoneFormValues, order?: number): Promise<Milestone> {
  const response = await authorizedFetch("/home/aspirations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values, order)),
  });

  const data = await parseApiResponse<AspirationApi>(response);
  return toMilestone(data);
}

export async function update(id: string, values: MilestoneFormValues): Promise<Milestone> {
  const response = await authorizedFetch(`/home/aspirations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<AspirationApi>(response);
  return toMilestone(data);
}

export async function deleteAspiration(id: string): Promise<void> {
  const response = await authorizedFetch(`/home/aspirations/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<Milestone[]> {
  const response = await authorizedFetch("/home/aspirations/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
