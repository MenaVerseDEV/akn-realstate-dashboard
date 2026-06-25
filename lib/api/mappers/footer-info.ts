import type {
  FooterInfo,
  FooterInfoApi,
  FooterInfoFormValues,
  LocalizedString,
} from "@/lib/types";

function normalizeLocalized(value: LocalizedString | undefined | null): LocalizedString {
  if (!value) {
    return { ar: "" };
  }

  const ar = value.ar?.trim() || value.en?.trim() || "";
  const en = value.en?.trim();

  return {
    ar,
    ...(en ? { en } : {}),
  };
}

function stringifyLocalized(value: LocalizedString): string {
  return JSON.stringify({
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  });
}

function resolveLogoUrl(api: FooterInfoApi): string | null {
  if (typeof api.logoUrl === "string" && api.logoUrl.length > 0) {
    return api.logoUrl;
  }
  if (typeof api.logoPath === "string" && api.logoPath.length > 0) {
    return api.logoPath;
  }
  return null;
}

export function toFooterInfo(api: FooterInfoApi): FooterInfo {
  const now = new Date().toISOString();

  return {
    companyName: normalizeLocalized(api.websiteName),
    description: normalizeLocalized(api.websiteDescription),
    address: normalizeLocalized(api.address),
    logoUrl: resolveLogoUrl(api),
    phone: api.phone ?? "",
    email: api.email ?? "",
    createdAt: api.createdAt ?? now,
    updatedAt: api.updatedAt ?? now,
  };
}

export function toFormData(values: FooterInfoFormValues): FormData {
  const formData = new FormData();

  formData.append("websiteName", stringifyLocalized(values.companyName));
  formData.append("websiteDescription", stringifyLocalized(values.description));
  formData.append("address", stringifyLocalized(values.address));
  formData.append("phone", values.phone);
  formData.append("email", values.email);

  if (values.logoFile instanceof File) {
    formData.append("logo", values.logoFile, values.logoFile.name);
  }

  return formData;
}
