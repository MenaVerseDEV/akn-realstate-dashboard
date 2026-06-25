import { toFormData } from "@/lib/api/mappers/footer-info";
import type { FooterInfo, FooterInfoFormValues } from "@/lib/types";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (body as { message?: string } | null)?.message ?? "فشل الطلب";
    throw new Error(message);
  }

  return body as T;
}

export async function getFooterInfo(): Promise<FooterInfo> {
  const response = await fetch("/api/footer/info", {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseJsonResponse<{ info: FooterInfo }>(response);
  return data.info;
}

export async function updateFooterInfo(values: FooterInfoFormValues): Promise<FooterInfo> {
  const response = await fetch("/api/footer/info", {
    method: "PUT",
    body: toFormData(values),
  });

  const data = await parseJsonResponse<{ info: FooterInfo }>(response);
  return data.info;
}
