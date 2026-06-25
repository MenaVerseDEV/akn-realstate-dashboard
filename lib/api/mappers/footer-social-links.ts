import type {
  SocialLink,
  SocialLinkApi,
  SocialLinkFormValues,
  SocialLinkInput,
} from "@/lib/types";
import { toApiIcon, toDisplayIcon } from "@/lib/icons";

export { toApiIcon, toDisplayIcon } from "@/lib/icons";

export function toSocialLink(api: SocialLinkApi, index = 0): SocialLink {
  return {
    id: api.id,
    platform: api.platformName,
    url: api.link,
    icon: toDisplayIcon(api.icon),
    order: api.order ?? index,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function assignOrder(items: SocialLink[]): SocialLink[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

export function toApiInput(values: SocialLinkFormValues): SocialLinkInput {
  return {
    platformName: values.platform,
    icon: toApiIcon(values.icon),
    link: values.url,
  };
}
