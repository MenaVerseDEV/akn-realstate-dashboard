import { toApiIcon, toDisplayIcon } from "@/lib/icons";
import type {
  About,
  AboutCard,
  AboutCardApi,
  AboutFormValues,
  AboutUsSectionApi,
  LocalizedString,
} from "@/lib/types";

function stringifyLocalized(value: LocalizedString): string {
  return JSON.stringify({
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  });
}

export function toAboutCard(apiItem: AboutCardApi): AboutCard {
  return {
    id: `card-${apiItem.order}`,
    title: apiItem.title,
    icon: toDisplayIcon(apiItem.icon),
    order: apiItem.order,
  };
}

export function toCardItem(card: AboutCard, order: number): AboutCardApi {
  return {
    order,
    icon: toApiIcon(card.icon),
    title: card.title,
  };
}

function resolveImageUrl(api: AboutUsSectionApi): string | null {
  if (typeof api.imageUrl === "string" && api.imageUrl.length > 0) {
    return api.imageUrl;
  }
  if (typeof api.imagePath === "string" && api.imagePath.length > 0) {
    return api.imagePath;
  }
  return null;
}

export function toAbout(api: AboutUsSectionApi): About {
  const cards = [...api.cards]
    .sort((a, b) => a.order - b.order)
    .map(toAboutCard);

  return {
    id: "about-us-section",
    eyebrow: api.subtitle,
    title: api.title,
    description: api.description,
    imageUrl: resolveImageUrl(api),
    cards,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toFormData(values: AboutFormValues): FormData {
  const formData = new FormData();

  formData.append("subtitle", stringifyLocalized(values.eyebrow));
  formData.append("title", stringifyLocalized(values.title));
  formData.append("description", stringifyLocalized(values.description));

  const cards = values.cards
    .map((card, index) => toCardItem(card, index + 1))
    .sort((a, b) => a.order - b.order);

  formData.append("cards", JSON.stringify(cards));

  if (values.imageFile instanceof File) {
    formData.append("image", values.imageFile, values.imageFile.name);
  }

  return formData;
}

export function aboutToFormValues(about: About): AboutFormValues {
  return {
    eyebrow: about.eyebrow,
    title: about.title,
    description: about.description,
    imageUrl: about.imageUrl,
    imageFile: null,
    cards: about.cards,
  };
}
