import type {
  FooterService,
  FooterServiceApi,
  FooterServiceFormValues,
  FooterServiceInput,
  LocalizedString,
} from "@/lib/types";

function parseTitle(
  title: LocalizedString | string,
  fallbackEn?: string,
): LocalizedString {
  if (typeof title === "object" && title !== null && "ar" in title) {
    return {
      ar: title.ar,
      ...(title.en ? { en: title.en } : fallbackEn ? { en: fallbackEn } : {}),
    };
  }

  return {
    ar: typeof title === "string" ? title : "",
    ...(fallbackEn ? { en: fallbackEn } : {}),
  };
}

export function toFooterService(api: FooterServiceApi, titleEn?: string): FooterService {
  return {
    id: api.id,
    title: parseTitle(api.title, titleEn),
    link: api.link,
    order: api.order ?? 0,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mergeFooterServiceLists(
  arItems: FooterServiceApi[],
  enItems: FooterServiceApi[],
): FooterService[] {
  const enById = new Map(enItems.map((item) => [item.id, item]));

  return arItems
    .map((arItem) => {
      const enItem = enById.get(arItem.id);
      const titleEn =
        enItem && typeof enItem.title === "string"
          ? enItem.title
          : enItem && typeof enItem.title === "object"
            ? enItem.title.en
            : undefined;

      return toFooterService(arItem, titleEn);
    })
    .map((item, index) => ({ ...item, order: index }));
}

export function toApiInput(values: FooterServiceFormValues): FooterServiceInput {
  return {
    title: {
      ar: values.title.ar,
      ...(values.title.en ? { en: values.title.en } : {}),
    },
    link: values.link,
  };
}
