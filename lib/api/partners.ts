import { authFetch } from "@/lib/api/fetch-auth";
import { mergePartnerLists, toFormData, toPartner } from "@/lib/api/mappers/partners";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Partner, PartnerApi, PartnerFormValues } from "@/lib/types";

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

export async function list(): Promise<Partner[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/home/partners", { method: "GET" }, "ar"),
    authorizedFetch("/home/partners", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<PartnerApi[]>(arResponse),
    parseApiResponse<PartnerApi[]>(enResponse),
  ]);

  return mergePartnerLists(arItems, enItems);
}

export async function getById(id: string): Promise<Partner> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/home/partners/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/home/partners/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<PartnerApi>(arResponse),
    parseApiResponse<PartnerApi>(enResponse),
  ]);

  const nameEn = typeof enItem.name === "string" ? enItem.name : enItem.name.en;

  return toPartner(arItem, nameEn);
}

export async function create(values: PartnerFormValues, order?: number): Promise<Partner> {
  const response = await authorizedFetch("/home/partners", {
    method: "POST",
    body: toFormData(values, order),
  });

  const data = await parseApiResponse<PartnerApi>(response);
  return toPartner(data);
}

export async function update(id: string, values: PartnerFormValues): Promise<Partner> {
  const response = await authorizedFetch(`/home/partners/${id}`, {
    method: "PATCH",
    body: toFormData(values),
  });

  const data = await parseApiResponse<PartnerApi>(response);
  return toPartner(data);
}

export async function deletePartner(id: string): Promise<void> {
  const response = await authorizedFetch(`/home/partners/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<Partner[]> {
  const response = await authorizedFetch("/home/partners/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
