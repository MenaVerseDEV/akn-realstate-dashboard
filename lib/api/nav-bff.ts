import {
  authorizedJsonFetch,
  getApiBaseUrl,
  parseApiResponse,
} from "@/lib/auth/server";
import { mergeNavLists, toNavLink } from "@/lib/api/mappers/nav-bar-pages";
import type { NavBarPageApi, NavLink } from "@/lib/types";

export async function fetchMergedNavList(accessToken: string): Promise<NavLink[]> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedJsonFetch(accessToken, "/nav-bar-pages", { method: "GET" }, "ar"),
    authorizedJsonFetch(accessToken, "/nav-bar-pages", { method: "GET" }, "en"),
  ]);

  const [arItems, enItems] = await Promise.all([
    parseApiResponse<NavBarPageApi[]>(arResponse),
    parseApiResponse<NavBarPageApi[]>(enResponse),
  ]);

  return mergeNavLists(arItems, enItems);
}

export async function fetchNavById(accessToken: string, id: string): Promise<NavLink> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedJsonFetch(accessToken, `/nav-bar-pages/${id}`, { method: "GET" }, "ar"),
    authorizedJsonFetch(accessToken, `/nav-bar-pages/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<NavBarPageApi>(arResponse),
    parseApiResponse<NavBarPageApi>(enResponse),
  ]);

  const titleEn = typeof enItem.title === "string" ? enItem.title : enItem.title.en;
  return toNavLink(arItem, titleEn);
}

export { getApiBaseUrl };
