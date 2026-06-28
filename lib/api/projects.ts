import { authFetch } from "@/lib/api/fetch-auth";
import {
  buildListQuery,
  mergeProjectLists,
  toApiInput,
  toProject,
} from "@/lib/api/mappers/projects";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  Project,
  ProjectApi,
  ProjectFormValues,
  ProjectsListApiResponse,
  ProjectsListParams,
  ProjectsListResult,
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

export async function list(params: ProjectsListParams = {}): Promise<ProjectsListResult> {
  const query = buildListQuery(params);

  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/projects${query}`, { method: "GET" }, "ar"),
    authorizedFetch(`/projects${query}`, { method: "GET" }, "en"),
  ]);

  const [arData, enData] = await Promise.all([
    parseApiResponse<ProjectsListApiResponse>(arResponse),
    parseApiResponse<ProjectsListApiResponse>(enResponse),
  ]);

  return mergeProjectLists(arData, enData);
}

export async function getById(id: string): Promise<Project> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/projects/${id}`, { method: "GET" }, "ar"),
    authorizedFetch(`/projects/${id}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<ProjectApi>(arResponse),
    parseApiResponse<ProjectApi>(enResponse),
  ]);

  const nameEn = typeof enItem.name === "string" ? enItem.name : enItem.name.en;
  const descriptionEn =
    typeof enItem.description === "string" ? enItem.description : enItem.description.en;

  return toProject(arItem, nameEn, descriptionEn);
}

export async function getBySlug(slug: string): Promise<Project> {
  const [arResponse, enResponse] = await Promise.all([
    authorizedFetch(`/projects/slug/${slug}`, { method: "GET" }, "ar"),
    authorizedFetch(`/projects/slug/${slug}`, { method: "GET" }, "en"),
  ]);

  const [arItem, enItem] = await Promise.all([
    parseApiResponse<ProjectApi>(arResponse),
    parseApiResponse<ProjectApi>(enResponse),
  ]);

  const nameEn = typeof enItem.name === "string" ? enItem.name : enItem.name.en;
  const descriptionEn =
    typeof enItem.description === "string" ? enItem.description : enItem.description.en;

  return toProject(arItem, nameEn, descriptionEn);
}

export async function create(values: ProjectFormValues): Promise<Project> {
  const response = await authorizedFetch("/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<ProjectApi>(response);
  return toProject(data);
}

export async function update(id: string, values: ProjectFormValues): Promise<Project> {
  const response = await authorizedFetch(`/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });

  const data = await parseApiResponse<ProjectApi>(response);
  return toProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  const response = await authorizedFetch(`/projects/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}
