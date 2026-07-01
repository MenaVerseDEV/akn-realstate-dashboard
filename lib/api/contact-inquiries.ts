import { authFetch } from "@/lib/api/fetch-auth";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  ContactInquiriesListApiResponse,
  ContactInquiriesListParams,
  ContactInquiriesListResult,
  ContactInquiry,
  ContactInquiryStatus,
  ContactInquiryStatusInput,
} from "@/lib/types";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

function buildListQuery(params: ContactInquiriesListParams): string {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export async function list(
  params: ContactInquiriesListParams = {},
): Promise<ContactInquiriesListResult> {
  const response = await authorizedFetch(`/contact-inquiries${buildListQuery(params)}`, {
    method: "GET",
  });
  const data = await parseApiResponse<ContactInquiriesListApiResponse>(response);
  return { items: data.items, meta: data.meta };
}

export async function updateStatus(
  id: string,
  input: ContactInquiryStatusInput,
): Promise<ContactInquiry> {
  const response = await authorizedFetch(`/contact-inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<ContactInquiry>(response);
}

export const CONTACT_INQUIRY_STATUSES: ContactInquiryStatus[] = ["new", "contacted", "close"];
