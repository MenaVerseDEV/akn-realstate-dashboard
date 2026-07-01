import type {
  LocalizedString,
  ProjectUnit,
  ProjectUnitApi,
  ProjectUnitFormValues,
  ProjectUnitInput,
  ProjectUnitsListParams,
} from "@/lib/types";

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

export function toProjectUnit(api: ProjectUnitApi, descriptionEn?: string): ProjectUnit {
  return {
    id: api.id,
    projectId: api.projectId,
    unitNumber: api.unitNumber,
    unitType: api.unitType,
    bedrooms: api.bedrooms,
    bathrooms: api.bathrooms,
    area: api.area,
    floor: api.floor,
    status: api.status,
    description: parseLocalizedField(api.description, descriptionEn),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toUnitApiInput(values: ProjectUnitFormValues): ProjectUnitInput {
  return {
    unitNumber: values.unitNumber,
    unitType: values.unitType,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area: values.area,
    floor: values.floor,
    status: values.status,
    description: {
      ar: values.description.ar,
      ...(values.description.en ? { en: values.description.en } : {}),
    },
  };
}

export function buildUnitsListQuery(params: ProjectUnitsListParams): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
