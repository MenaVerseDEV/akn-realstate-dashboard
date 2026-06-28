import { authFetch } from "@/lib/api/fetch-auth";
import { toApiInput, toContact } from "@/lib/api/mappers/contact-us-section";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Contact, ContactFormValues, ContactUsSectionApi } from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function getContact(): Promise<Contact> {
  const response = await authorizedFetch("/home/contact-us-section", { method: "GET" });
  const data = await parseApiResponse<ContactUsSectionApi>(response);
  return toContact(data);
}

export async function updateContact(values: ContactFormValues): Promise<Contact> {
  const response = await authorizedFetch("/home/contact-us-section", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiInput(values)),
  });
  const data = await parseApiResponse<ContactUsSectionApi>(response);
  return toContact(data);
}
