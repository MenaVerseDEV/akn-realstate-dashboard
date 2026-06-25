import { authFetch } from "@/lib/api/fetch-auth";
import {
  mergeFooterServiceLists,
  toApiInput,
  toFooterService,
} from "@/lib/api/mappers/footer-services";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  FooterService,
  FooterServiceApi,
  FooterServiceFormValues,
} from "@/lib/types";

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

export async function list(): Promise<FooterService[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch("/footer/services", { method: "GET" }, "ar"),
    authorizedFetch("/footer/services", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<FooterServiceApi[]>(arResponse),
    parseApiResponse<FooterServiceApi[]>(enResponse),
  ]);

  return mergeFooterServiceLists(arItems, enItems);
}

export async function getById(id: string): Promise<FooterService> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/footer/services/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/footer/services/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<FooterServiceApi>(arResponse),
    parseApiResponse<FooterServiceApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  return toFooterService(arItem, titleEn);
}

export async function create(values: FooterServiceFormValues): Promise<FooterService> {
  const response = await authorizedFetch("/footer/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<FooterServiceApi>(response);
  return toFooterService(data);
}

export async function update(id: string, values: FooterServiceFormValues): Promise<FooterService> {
  const response = await authorizedFetch(`/footer/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<FooterServiceApi>(response);
  return toFooterService(data);
}

export async function deleteService(id: string): Promise<void> {
  const response = await authorizedFetch(`/footer/services/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}

export async function reorder(ids: string[]): Promise<FooterService[]> {
  const response = await authorizedFetch("/footer/services/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  await parseApiResponse<unknown>(response);
  return list();
}
