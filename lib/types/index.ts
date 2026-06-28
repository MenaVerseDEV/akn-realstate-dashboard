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

export type HeroAnalysisApi = {
  order: number;
  icon: string;
  value: string;
  label: LocalizedString;
};

export type HeroSectionApi = {
  subtitle: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  backgroundImagePath?: string | null;
  backgroundImageUrl?: string | null;
  primaryButtonLink: string;
  primaryButtonLabel: LocalizedString;
  secondaryButtonLink: string;
  secondaryButtonLabel: LocalizedString;
  analysis: HeroAnalysisApi[];
  createdAt: string;
  updatedAt: string;
};

export type Hero = {
  id: string;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  primaryCtaLabel: LocalizedString;
  primaryCtaHref: string;
  secondaryCtaLabel: LocalizedString;
  secondaryCtaHref: string;
  backgroundMediaUrl: string | null;
  stats: HeroStat[];
  createdAt: string;
  updatedAt: string;
};

export type HeroFormValues = {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  primaryCtaLabel: LocalizedString;
  primaryCtaHref: string;
  secondaryCtaLabel: LocalizedString;
  secondaryCtaHref: string;
  backgroundMediaUrl: string | null;
  backgroundImageFile?: File | null;
  stats: HeroStat[];
};

export type AboutCard = {
  id: string;
  title: LocalizedString;
  icon: string;
  order: number;
};

export type AboutCardApi = {
  order: number;
  icon: string;
  title: LocalizedString;
};

export type AboutUsSectionApi = {
  subtitle: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  imagePath?: string | null;
  imageUrl?: string | null;
  cards: AboutCardApi[];
  createdAt: string;
  updatedAt: string;
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

export type AboutFormValues = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string | null;
  imageFile?: File | null;
  cards: AboutCard[];
};

export type ProjectStatus = "planning" | "in_progress" | "completed" | "in_hold";

export type ProjectMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  caption: LocalizedString | null;
  order: number;
};

export type ProjectMediaApi = {
  id: string;
  projectId: string;
  imagePath?: string | null;
  imageUrl?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMediaInput = {
  imageFile: File;
  order: number;
};

export type ProjectMediaPatchInput = {
  imageFile?: File | null;
  order?: number;
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

export type ProjectApi = {
  id: string;
  slug: string;
  name: LocalizedString | string;
  description: LocalizedString | string;
  status: ProjectStatus;
  isPublished: boolean;
  media: ProjectMediaApi[] | ProjectMedia[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectFormValues = {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  status: ProjectStatus;
  published: boolean;
};

export type ProjectInput = {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  status: ProjectStatus;
  isPublished: boolean;
};

export type ProjectsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus | "";
  isPublished?: boolean;
};

export type ProjectsListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ProjectsListResult = {
  items: Project[];
  meta: ProjectsListMeta;
};

export type ProjectsListApiResponse = {
  items: ProjectApi[];
  meta: ProjectsListMeta;
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

export type AspirationApi = {
  id: string;
  year: number;
  order: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type MilestoneFormValues = {
  year: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
};

export type AspirationInput = {
  year: number;
  order?: number;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
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

export type ValueApi = {
  id: string;
  order: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  colorGradient: string;
  createdAt: string;
  updatedAt: string;
};

export type ValueFormValues = {
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  color: string;
};

export type ValueInput = {
  order?: number;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  colorGradient: string;
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

export type FeatureApi = {
  id: string;
  order: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type FeatureFormValues = {
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
};

export type FeatureInput = {
  order?: number;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
};

export type Partner = {
  id: string;
  name: LocalizedString;
  logoUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type PartnerApi = {
  id: string;
  order: number;
  name: LocalizedString | string;
  logoPath?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerFormValues = {
  name: LocalizedString;
  logoUrl: string | null;
  logoFile?: File | null;
};

export type PartnerInput = {
  order?: number;
  name: LocalizedString;
  logoFile?: File | null;
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

export type FooterServiceApi = {
  id: string;
  title: string | LocalizedString;
  link: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

export type FooterServiceInput = {
  title: { ar: string; en?: string };
  link: string;
};

export type FooterService = {
  id: string;
  title: LocalizedString;
  link: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type FooterServiceFormValues = {
  title: LocalizedString;
  link: string;
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

export type SocialLinkApi = {
  id: string;
  platformName: string;
  icon: string;
  link: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

export type SocialLinkInput = {
  platformName: string;
  icon: string;
  link: string;
};

export type SocialLinkFormValues = {
  platform: string;
  url: string;
  icon: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
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
