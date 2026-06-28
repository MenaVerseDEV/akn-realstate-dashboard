import type {
  LocalizedString,
  Partner,
  PartnerApi,
  PartnerFormValues,
} from "@/lib/types";

function stringifyLocalized(value: LocalizedString): string {
  return JSON.stringify({
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  });
}

function parseLocalizedField(
  value: LocalizedString | string,
  fallbackEn?: string,
): LocalizedString {
  if (typeof value === "object" && value !== null && "ar" in value) {
    return {
      ar: value.ar,
      ...(value.en ? { en: value.en } : fallbackEn ? { en: fallbackEn } : {}),
    };
  }

  return {
    ar: typeof value === "string" ? value : "",
    ...(fallbackEn ? { en: fallbackEn } : {}),
  };
}

function localizedEn(value: LocalizedString | string): string | undefined {
  if (typeof value === "object" && value !== null && "en" in value) {
    return value.en;
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function resolveLogoUrl(api: PartnerApi): string | null {
  if (typeof api.logoUrl === "string" && api.logoUrl.length > 0) {
    return api.logoUrl;
  }
  if (typeof api.logoPath === "string" && api.logoPath.length > 0) {
    return api.logoPath;
  }
  return null;
}

export function toPartner(api: PartnerApi, nameEn?: string): Partner {
  return {
    id: api.id,
    name: parseLocalizedField(api.name, nameEn),
    logoUrl: resolveLogoUrl(api),
    order: api.order ?? 0,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mergePartnerLists(
  arItems: PartnerApi[],
  enItems: PartnerApi[],
): Partner[] {
  const enById = new Map(enItems.map((item) => [item.id, item]));

  return arItems
    .map((arItem) => {
      const enItem = enById.get(arItem.id);
      const nameEn = enItem ? localizedEn(enItem.name) : undefined;
      return toPartner(arItem, nameEn);
    })
    .map((item, index) => ({ ...item, order: index }));
}

export function toFormData(values: PartnerFormValues, order?: number): FormData {
  const formData = new FormData();

  if (order !== undefined) {
    formData.append("order", String(order));
  }

  formData.append("name", stringifyLocalized(values.name));

  if (values.logoFile instanceof File) {
    formData.append("logo", values.logoFile, values.logoFile.name);
  }

  return formData;
}
