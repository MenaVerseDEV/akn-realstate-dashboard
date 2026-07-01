import { authFetch } from "@/lib/api/fetch-auth";
import { toFormData, toSiteSettings } from "@/lib/api/mappers/website-settings";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { SiteSettings, SiteSettingsFormValues, WebsiteSettingsApi } from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function getSettings(): Promise<SiteSettings> {
  const response = await authorizedFetch("/website-settings", { method: "GET" });
  const data = await parseApiResponse<WebsiteSettingsApi>(response);
  return toSiteSettings(data);
}

export async function updateSettings(values: SiteSettingsFormValues): Promise<SiteSettings> {
  const response = await authorizedFetch("/website-settings", {
    method: "PUT",
    body: toFormData(values),
  });
  const data = await parseApiResponse<WebsiteSettingsApi>(response);
  return toSiteSettings(data);
}
