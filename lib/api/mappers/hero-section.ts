import { toApiIcon, toDisplayIcon } from "@/lib/icons";
import type {
  Hero,
  HeroAnalysisApi,
  HeroFormValues,
  HeroSectionApi,
  HeroStat,
  LocalizedString,
} from "@/lib/types";

function stringifyLocalized(value: LocalizedString): string {
  return JSON.stringify({
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  });
}

export function parseStatValue(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { value: 0, suffix: "" };
  }
  return {
    value: Number(match[1]),
    suffix: match[2] ?? "",
  };
}

export function formatStatValue(value: number, suffix: string): string {
  return `${value}${suffix}`;
}

export function toHeroStat(apiItem: HeroAnalysisApi): HeroStat {
  const { value, suffix } = parseStatValue(apiItem.value);

  return {
    id: `stat-${apiItem.order}`,
    value,
    suffix,
    label: apiItem.label,
    icon: toDisplayIcon(apiItem.icon),
    order: apiItem.order,
  };
}

export function toAnalysisItem(stat: HeroStat, order: number): HeroAnalysisApi {
  return {
    order,
    icon: toApiIcon(stat.icon),
    value: formatStatValue(stat.value, stat.suffix),
    label: stat.label,
  };
}

function resolveBackgroundUrl(api: HeroSectionApi): string | null {
  if (typeof api.backgroundImageUrl === "string" && api.backgroundImageUrl.length > 0) {
    return api.backgroundImageUrl;
  }
  if (typeof api.backgroundImagePath === "string" && api.backgroundImagePath.length > 0) {
    return api.backgroundImagePath;
  }
  return null;
}

export function toHero(api: HeroSectionApi): Hero {
  const stats = [...api.analysis]
    .sort((a, b) => a.order - b.order)
    .map(toHeroStat);

  return {
    id: "hero-section",
    badge: api.subtitle,
    title: api.title,
    description: api.description,
    primaryCtaLabel: api.primaryButtonLabel,
    primaryCtaHref: api.primaryButtonLink,
    secondaryCtaLabel: api.secondaryButtonLabel,
    secondaryCtaHref: api.secondaryButtonLink,
    backgroundMediaUrl: resolveBackgroundUrl(api),
    stats,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toFormData(values: HeroFormValues): FormData {
  const formData = new FormData();

  formData.append("subtitle", stringifyLocalized(values.badge));
  formData.append("title", stringifyLocalized(values.title));
  formData.append("description", stringifyLocalized(values.description));
  formData.append("primaryButtonLabel", stringifyLocalized(values.primaryCtaLabel));
  formData.append("secondaryButtonLabel", stringifyLocalized(values.secondaryCtaLabel));
  formData.append("primaryButtonLink", values.primaryCtaHref);
  formData.append("secondaryButtonLink", values.secondaryCtaHref);

  const analysis = values.stats
    .map((stat, index) => toAnalysisItem(stat, index + 1))
    .sort((a, b) => a.order - b.order);

  formData.append("analysis", JSON.stringify(analysis));

  if (values.backgroundImageFile instanceof File) {
    formData.append("backgroundImage", values.backgroundImageFile, values.backgroundImageFile.name);
  }

  return formData;
}

export function heroToFormValues(hero: Hero): HeroFormValues {
  return {
    badge: hero.badge,
    title: hero.title,
    description: hero.description,
    primaryCtaLabel: hero.primaryCtaLabel,
    primaryCtaHref: hero.primaryCtaHref,
    secondaryCtaLabel: hero.secondaryCtaLabel,
    secondaryCtaHref: hero.secondaryCtaHref,
    backgroundMediaUrl: hero.backgroundMediaUrl,
    backgroundImageFile: null,
    stats: hero.stats,
  };
}
