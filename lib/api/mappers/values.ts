import type {
  LocalizedString,
  Value,
  ValueApi,
  ValueFormValues,
  ValueInput,
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

function localizedEn(value: LocalizedString | string): string | undefined {
  if (typeof value === "object" && value !== null && "en" in value) {
    return value.en;
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function toValue(
  api: ValueApi,
  titleEn?: string,
  descriptionEn?: string,
): Value {
  return {
    id: api.id,
    title: parseLocalizedField(api.title, titleEn),
    description: parseLocalizedField(api.description, descriptionEn),
    icon: api.icon,
    color: api.colorGradient,
    order: api.order ?? 0,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mergeValueLists(arItems: ValueApi[], enItems: ValueApi[]): Value[] {
  const enById = new Map(enItems.map((item) => [item.id, item]));

  return arItems
    .map((arItem) => {
      const enItem = enById.get(arItem.id);
      const titleEn = enItem ? localizedEn(enItem.title) : undefined;
      const descriptionEn = enItem ? localizedEn(enItem.description) : undefined;
      return toValue(arItem, titleEn, descriptionEn);
    })
    .map((item, index) => ({ ...item, order: index }));
}

export function toApiInput(values: ValueFormValues, order?: number): ValueInput {
  return {
    ...(order !== undefined ? { order } : {}),
    title: {
      ar: values.title.ar,
      ...(values.title.en ? { en: values.title.en } : {}),
    },
    description: {
      ar: values.description.ar,
      ...(values.description.en ? { en: values.description.en } : {}),
    },
    icon: values.icon,
    colorGradient: values.color,
  };
}
