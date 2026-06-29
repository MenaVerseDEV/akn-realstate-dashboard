import { authFetch } from "@/lib/api/fetch-auth";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type { Contact, ContactUsSection, ContactUsSectionInput } from "@/lib/types";

const CONTACT_ID = "contact-us-section";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

function withId(data: ContactUsSection): Contact {
  return { id: CONTACT_ID, ...data };
}

export async function getContact(): Promise<Contact> {
  const response = await authorizedFetch("/home/contact-us-section", { method: "GET" });
  const data = await parseApiResponse<ContactUsSection>(response);
  return withId(data);
}

export async function updateContact(values: ContactUsSectionInput): Promise<Contact> {
  const response = await authorizedFetch("/home/contact-us-section", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await parseApiResponse<ContactUsSection>(response);
  return withId(data);
}
