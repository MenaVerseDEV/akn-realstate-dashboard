import { authFetch } from "@/lib/api/fetch-auth";
import { toFormData, toHero } from "@/lib/api/mappers/hero-section";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Hero, HeroFormValues, HeroSectionApi } from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function getHero(): Promise<Hero> {
  const response = await authorizedFetch("/home/hero-section", { method: "GET" });
  const data = await parseApiResponse<HeroSectionApi>(response);
  return toHero(data);
}

export async function updateHero(values: HeroFormValues): Promise<Hero> {
  const response = await authorizedFetch("/home/hero-section", {
    method: "PUT",
    body: toFormData(values),
  });
  const data = await parseApiResponse<HeroSectionApi>(response);
  return toHero(data);
}
