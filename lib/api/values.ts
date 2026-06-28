import { authFetch } from "@/lib/api/fetch-auth";
import { mergeValueLists, toApiInput, toValue } from "@/lib/api/mappers/values";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Value, ValueApi, ValueFormValues } from "@/lib/types";

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

export async function list(): Promise<Value[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/home/values", { method: "GET" }, "ar"),
    authorizedFetch("/home/values", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<ValueApi[]>(arResponse),
    parseApiResponse<ValueApi[]>(enResponse),
  ]);

  return mergeValueLists(arItems, enItems);
}

export async function getById(id: string): Promise<Value> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/home/values/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/home/values/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<ValueApi>(arResponse),
    parseApiResponse<ValueApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  const descriptionEn =
    typeof enItem.description === "string" ? enItem.description : enItem.description.en;

  return toValue(arItem, titleEn, descriptionEn);
}

export async function create(values: ValueFormValues, order?: number): Promise<Value> {
  const response = await authorizedFetch("/home/values", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values, order)),
  });

  const data = await parseApiResponse<ValueApi>(response);
  return toValue(data);
}

export async function update(id: string, values: ValueFormValues): Promise<Value> {
  const response = await authorizedFetch(`/home/values/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<ValueApi>(response);
  return toValue(data);
}

export async function deleteValue(id: string): Promise<void> {
  const response = await authorizedFetch(`/home/values/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<Value[]> {
  const response = await authorizedFetch("/home/values/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
