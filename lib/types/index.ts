export type LocalizedString = {
  ar: string;
  en?: string;
};

export const DEFAULT_LANGUAGES = ["en", "ar"] as const;
export type DefaultLanguage = (typeof DEFAULT_LANGUAGES)[number];

export type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserRole = "super_admin" | "admin";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type SiteSettings = {
  id: string;
  siteName: LocalizedString;
  logoUrl: string | null;
  defaultLocale: DefaultLanguage;
  createdAt: string;
  updatedAt: string;
};

export type WebsiteSettingsApi = {
  id?: string;
  websiteName: LocalizedString;
  defaultLanguage: DefaultLanguage;
  logoUrl?: string | null;
  logo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteSettingsFormValues = {
  siteName: LocalizedString;
  logoUrl: string | null;
  defaultLocale: DefaultLanguage;
  logoFile?: File | null;
};

export type NavLink = {
  id: string;
  label: LocalizedString;
  href: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NavBarPageApi = {
  id: string;
  title: LocalizedString | string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type NavBarPageInput = {
  title: LocalizedString;
  link: string;
  isActive: boolean;
};

export type NavLinkFormValues = {
  label: LocalizedString;
  href: string;
  visible: boolean;
};

export type HeroStat = {
  id: string;
  value: number;
  suffix: string;
  label: LocalizedString;
  icon: string;
  order: number;
};

export type Hero = {
  id: string;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundMediaUrl: string | null;
  stats: HeroStat[];
  createdAt: string;
  updatedAt: string;
};

export type AboutCard = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  order: number;
};

export type About = {
  id: string;
  eyebrow: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string | null;
  cards: AboutCard[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = "planning" | "construction" | "completed";

export type ProjectMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  caption: LocalizedString | null;
  order: number;
};

export type Project = {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  status: ProjectStatus;
  published: boolean;
  media: ProjectMedia[];
  createdAt: string;
  updatedAt: string;
};

export type Milestone = {
  id: string;
  year: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type VideoShowcase = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  videoUrl: string | null;
  posterUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Value = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Feature = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Partner = {
  id: string;
  name: LocalizedString;
  logoUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  phone: string;
  email: string;
  mapUrl: string | null;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  createdAt: string;
  updatedAt: string;
};

export type FooterService = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  order: number;
};

export type FooterInfoApi = {
  websiteName: LocalizedString;
  websiteDescription: LocalizedString;
  address: LocalizedString;
  logoUrl?: string | null;
  logoPath?: string | null;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FooterInfo = {
  companyName: LocalizedString;
  description: LocalizedString;
  address: LocalizedString;
  logoUrl: string | null;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type FooterInfoFormValues = {
  companyName: LocalizedString;
  description: LocalizedString;
  address: LocalizedString;
  logoUrl: string | null;
  phone: string;
  email: string;
  logoFile?: File | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
};

export type Footer = {
  id: string;
  companyName: LocalizedString;
  description: LocalizedString;
  logoUrl: string | null;
  address: LocalizedString;
  phone: string;
  email: string;
  services: FooterService[];
  socials: SocialLink[];
  createdAt: string;
  updatedAt: string;
};

export type MediaType = "image" | "video";

export type MediaAsset = {
  id: string;
  url: string;
  type: MediaType;
  altText: LocalizedString | null;
  width: number | null;
  height: number | null;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CollectionModule =
  | "nav"
  | "projects"
  | "milestones"
  | "values"
  | "features"
  | "partners";

export const DEMO_EMAIL = "owner@akn.sa";
export const DEMO_PASSWORD = "admin123";
export const AUTH_COOKIE = "akn_auth_token";
export const REFRESH_COOKIE = "akn_refresh_token";
