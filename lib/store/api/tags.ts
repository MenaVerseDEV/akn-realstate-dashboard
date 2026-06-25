export type CacheTag =
  | "Settings"
  | "Nav"
  | "Hero"
  | "About"
  | "Projects"
  | "Milestones"
  | "Video"
  | "Values"
  | "Features"
  | "Partners"
  | "Contact"
  | "Footer"
  | "FooterInfo"
  | "Media"
  | "Auth"
  | { type: "Project"; id: string }
  | { type: "Nav"; id: string };

export const tags = {
  settings: ["Settings"] as CacheTag[],
  nav: ["Nav"] as CacheTag[],
  hero: ["Hero"] as CacheTag[],
  about: ["About"] as CacheTag[],
  projects: ["Projects"] as CacheTag[],
  project: (id: string): CacheTag[] => [{ type: "Project", id }],
  milestones: ["Milestones"] as CacheTag[],
  video: ["Video"] as CacheTag[],
  values: ["Values"] as CacheTag[],
  features: ["Features"] as CacheTag[],
  partners: ["Partners"] as CacheTag[],
  contact: ["Contact"] as CacheTag[],
  footer: ["Footer"] as CacheTag[],
  footerInfo: ["FooterInfo"] as CacheTag[],
  media: ["Media"] as CacheTag[],
  auth: ["Auth"] as CacheTag[],
};
