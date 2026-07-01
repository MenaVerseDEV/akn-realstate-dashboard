import { authFetch } from "@/lib/api/fetch-auth";
import {
  buildUnitsListQuery,
  toProjectUnit,
  toUnitApiInput,
} from "@/lib/api/mappers/project-units";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  ProjectUnit,
  ProjectUnitApi,
  ProjectUnitFormValues,
  ProjectUnitsListApiResponse,
  ProjectUnitsListParams,
  ProjectUnitsListResult,
} from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function list(
  projectId: string,
  params: ProjectUnitsListParams = {},
): Promise<ProjectUnitsListResult> {
  const query = buildUnitsListQuery(params);
  const response = await authorizedFetch(`/projects/${projectId}/units${query}`, {
    method: "GET",
  });
  const data = await parseApiResponse<ProjectUnitsListApiResponse>(response);
  return {
    items: data.items.map((item) => toProjectUnit(item)),
    meta: data.meta,
  };
}

export async function create(
  projectId: string,
  values: ProjectUnitFormValues,
): Promise<ProjectUnit> {
  const response = await authorizedFetch(`/projects/${projectId}/units`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toUnitApiInput(values)),
  });
  const data = await parseApiResponse<ProjectUnitApi>(response);
  return toProjectUnit(data);
}

export async function update(
  projectId: string,
  unitId: string,
  values: ProjectUnitFormValues,
): Promise<ProjectUnit> {
  const response = await authorizedFetch(`/projects/${projectId}/units/${unitId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toUnitApiInput(values)),
  });
  const data = await parseApiResponse<ProjectUnitApi>(response);
  return toProjectUnit(data);
}

export async function deleteUnit(projectId: string, unitId: string): Promise<void> {
  const response = await authorizedFetch(`/projects/${projectId}/units/${unitId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204) {
    await parseApiResponse<unknown>(response);
  }
}
