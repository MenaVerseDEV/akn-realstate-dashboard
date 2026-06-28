import { authFetch } from "@/lib/api/fetch-auth";
import { toAbout, toFormData } from "@/lib/api/mappers/about-us-section";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { About, AboutFormValues, AboutUsSectionApi } from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function getAbout(): Promise<About> {
  const response = await authorizedFetch("/home/about-us-section", { method: "GET" });
  const data = await parseApiResponse<AboutUsSectionApi>(response);
  return toAbout(data);
}

export async function updateAbout(values: AboutFormValues): Promise<About> {
  const response = await authorizedFetch("/home/about-us-section", {
    method: "PUT",
    body: toFormData(values),
  });
  const data = await parseApiResponse<AboutUsSectionApi>(response);
  return toAbout(data);
}
