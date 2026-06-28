import type { Contact, ContactFormValues, ContactUsSectionApi, LocalizedString } from "@/lib/types";

function localizedField(value: LocalizedString): LocalizedString {
  return {
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  };
}

export function toContact(api: ContactUsSectionApi): Contact {
  return {
    id: "contact-us-section",
    badge: api.subtitle,
    title: api.title,
    description: api.description,
    phone: api.phone,
    email: api.email,
    mapUrl: api.mapLink,
    primaryCtaLabel: api.primaryCtaLabel,
    primaryCtaHref: api.primaryCtaLink,
    secondaryCtaLabel: api.secondaryCtaLabel,
    secondaryCtaHref: api.secondaryCtaLink,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toApiInput(values: ContactFormValues) {
  return {
    subtitle: localizedField(values.badge),
    title: localizedField(values.title),
    description: localizedField(values.description),
    phone: values.phone,
    email: values.email,
    mapLink: values.mapUrl,
    primaryCtaLabel: localizedField(values.primaryCtaLabel),
    primaryCtaLink: values.primaryCtaHref,
    secondaryCtaLabel: localizedField(values.secondaryCtaLabel),
    secondaryCtaLink: values.secondaryCtaHref,
  };
}
