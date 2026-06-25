import type {
  DefaultLanguage,
  SiteSettings,
  SiteSettingsFormValues,
  WebsiteSettingsApi,
} from "@/lib/types";
import { DEFAULT_LANGUAGES } from "@/lib/types";

function parseDefaultLanguage(value: unknown): DefaultLanguage {
  if (typeof value === "string" && (DEFAULT_LANGUAGES as readonly string[]).includes(value)) {
    return value as DefaultLanguage;
  }
  return "ar";
}

function resolveLogoUrl(api: WebsiteSettingsApi): string | null {
  if (typeof api.logoUrl === "string" && api.logoUrl.length > 0) {
    return api.logoUrl;
  }
  if (typeof api.logo === "string" && api.logo.length > 0) {
    return api.logo;
  }
  return null;
}

export function toSiteSettings(api: WebsiteSettingsApi): SiteSettings {
  const now = new Date().toISOString();

  return {
    id: api.id ?? "website-settings",
    siteName: api.websiteName,
    logoUrl: resolveLogoUrl(api),
    defaultLocale: parseDefaultLanguage(api.defaultLanguage),
    createdAt: api.createdAt ?? now,
    updatedAt: api.updatedAt ?? now,
  };
}

export function toFormData(values: SiteSettingsFormValues): FormData {
  const formData = new FormData();

  formData.append(
    "websiteName",
    JSON.stringify({
      ar: values.siteName.ar,
      ...(values.siteName.en ? { en: values.siteName.en } : {}),
    }),
  );
  formData.append("defaultLanguage", values.defaultLocale);

  if (values.logoFile instanceof File) {
    formData.append("logo", values.logoFile, values.logoFile.name);
  }

  return formData;
}
