import { toFormData } from "@/lib/api/mappers/website-settings";
import type { SiteSettings, SiteSettingsFormValues } from "@/lib/types";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (body as { message?: string } | null)?.message ?? "فشل الطلب";
    throw new Error(message);
  }

  return body as T;
}

export async function getSettings(): Promise<SiteSettings> {
  const response = await fetch("/api/website-settings", {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseJsonResponse<{ settings: SiteSettings }>(response);
  return data.settings;
}

export async function updateSettings(values: SiteSettingsFormValues): Promise<SiteSettings> {
  const response = await fetch("/api/website-settings", {
    method: "PUT",
    body: toFormData(values),
  });

  const data = await parseJsonResponse<{ settings: SiteSettings }>(response);
  return data.settings;
}
