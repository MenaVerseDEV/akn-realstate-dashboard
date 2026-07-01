import { authFetch } from "@/lib/api/fetch-auth";
import { toFooterInfo, toFormData } from "@/lib/api/mappers/footer-info";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { FooterInfo, FooterInfoApi, FooterInfoFormValues } from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function getFooterInfo(): Promise<FooterInfo> {
  const response = await authorizedFetch("/footer/info", { method: "GET" });
  const data = await parseApiResponse<FooterInfoApi>(response);
  return toFooterInfo(data);
}

export async function updateFooterInfo(values: FooterInfoFormValues): Promise<FooterInfo> {
  const response = await authorizedFetch("/footer/info", {
    method: "PUT",
    body: toFormData(values),
  });
  const data = await parseApiResponse<FooterInfoApi>(response);
  return toFooterInfo(data);
}
