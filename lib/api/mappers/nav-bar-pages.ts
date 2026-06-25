import type {
  LocalizedString,
  NavBarPageApi,
  NavBarPageInput,
  NavLink,
  NavLinkFormValues,
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

export function toNavLink(api: NavBarPageApi, titleEn?: string): NavLink {
  return {
    id: api.id,
    label: parseTitle(api.title, titleEn),
    href: api.link,
    order: api.order,
    visible: api.isActive,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mergeNavLists(arItems: NavBarPageApi[], enItems: NavBarPageApi[]): NavLink[] {
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

      return toNavLink(arItem, titleEn);
    })
    .sort((a, b) => a.order - b.order);
}

export function toApiInput(values: NavLinkFormValues): NavBarPageInput {
  return {
    title: {
      ar: values.label.ar,
      ...(values.label.en ? { en: values.label.en } : {}),
    },
    link: values.href,
    isActive: values.visible,
  };
}
