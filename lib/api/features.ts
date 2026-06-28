import { authFetch } from "@/lib/api/fetch-auth";
import { mergeFeatureLists, toApiInput, toFeature } from "@/lib/api/mappers/features";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Feature, FeatureApi, FeatureFormValues } from "@/lib/types";

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

export async function list(): Promise<Feature[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/home/features", { method: "GET" }, "ar"),
    authorizedFetch("/home/features", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<FeatureApi[]>(arResponse),
    parseApiResponse<FeatureApi[]>(enResponse),
  ]);

  return mergeFeatureLists(arItems, enItems);
}

export async function getById(id: string): Promise<Feature> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/home/features/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/home/features/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<FeatureApi>(arResponse),
    parseApiResponse<FeatureApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  const descriptionEn =
    typeof enItem.description === "string" ? enItem.description : enItem.description.en;

  return toFeature(arItem, titleEn, descriptionEn);
}

export async function create(values: FeatureFormValues, order?: number): Promise<Feature> {
  const response = await authorizedFetch("/home/features", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values, order)),
  });

  const data = await parseApiResponse<FeatureApi>(response);
  return toFeature(data);
}

export async function update(id: string, values: FeatureFormValues): Promise<Feature> {
  const response = await authorizedFetch(`/home/features/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<FeatureApi>(response);
  return toFeature(data);
}

export async function deleteFeature(id: string): Promise<void> {
  const response = await authorizedFetch(`/home/features/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<Feature[]> {
  const response = await authorizedFetch("/home/features/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
