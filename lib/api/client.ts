import type {
  About,
  AboutCard,
  AuthResponse,
  Contact,
  Feature,
  Footer,
  FooterService,
  Hero,
  HeroStat,
  MediaAsset,
  MediaType,
  Milestone,
  NavLink,
  PaginatedResponse,
  Partner,
  Project,
  ProjectMedia,
  SiteSettings,
  SocialLink,
  User,
  Value,
  VideoShowcase,
} from "@/lib/types";

export interface ApiClient {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  me(): Promise<User>;

  getSettings(): Promise<SiteSettings>;
  updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings>;

  getNav(): Promise<NavLink[]>;
  createNav(data: Omit<NavLink, "id" | "order" | "createdAt" | "updatedAt">): Promise<NavLink>;
  updateNav(id: string, data: Partial<NavLink>): Promise<NavLink>;
  deleteNav(id: string): Promise<void>;
  reorderNav(ids: string[]): Promise<NavLink[]>;

  getHero(): Promise<Hero>;
  updateHero(data: Partial<Hero>): Promise<Hero>;
  createHeroStat(data: Omit<HeroStat, "id" | "order">): Promise<HeroStat>;
  updateHeroStat(id: string, data: Partial<HeroStat>): Promise<HeroStat>;
  deleteHeroStat(id: string): Promise<void>;
  reorderHeroStats(ids: string[]): Promise<HeroStat[]>;

  getAbout(): Promise<About>;
  updateAbout(data: Partial<About>): Promise<About>;
  createAboutCard(data: Omit<AboutCard, "id" | "order">): Promise<AboutCard>;
  updateAboutCard(id: string, data: Partial<AboutCard>): Promise<AboutCard>;
  deleteAboutCard(id: string): Promise<void>;
  reorderAboutCards(ids: string[]): Promise<AboutCard[]>;

  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project>;
  createProject(data: Omit<Project, "id" | "media" | "createdAt" | "updatedAt">): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  getProjectMedia(projectId: string): Promise<ProjectMedia[]>;
  addProjectMedia(projectId: string, data: Omit<ProjectMedia, "id" | "order">): Promise<ProjectMedia>;
  updateProjectMedia(projectId: string, mediaId: string, data: Partial<ProjectMedia>): Promise<ProjectMedia>;
  deleteProjectMedia(projectId: string, mediaId: string): Promise<void>;
  reorderProjectMedia(projectId: string, ids: string[]): Promise<ProjectMedia[]>;

  getMilestones(): Promise<Milestone[]>;
  createMilestone(data: Omit<Milestone, "id" | "order" | "createdAt" | "updatedAt">): Promise<Milestone>;
  updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone>;
  deleteMilestone(id: string): Promise<void>;
  reorderMilestones(ids: string[]): Promise<Milestone[]>;

  getVideo(): Promise<VideoShowcase>;
  updateVideo(data: Partial<VideoShowcase>): Promise<VideoShowcase>;

  getValues(): Promise<Value[]>;
  createValue(data: Omit<Value, "id" | "order" | "createdAt" | "updatedAt">): Promise<Value>;
  updateValue(id: string, data: Partial<Value>): Promise<Value>;
  deleteValue(id: string): Promise<void>;
  reorderValues(ids: string[]): Promise<Value[]>;

  getFeatures(): Promise<Feature[]>;
  createFeature(data: Omit<Feature, "id" | "order" | "createdAt" | "updatedAt">): Promise<Feature>;
  updateFeature(id: string, data: Partial<Feature>): Promise<Feature>;
  deleteFeature(id: string): Promise<void>;
  reorderFeatures(ids: string[]): Promise<Feature[]>;

  getPartners(): Promise<Partner[]>;
  createPartner(data: Omit<Partner, "id" | "order" | "createdAt" | "updatedAt">): Promise<Partner>;
  updatePartner(id: string, data: Partial<Partner>): Promise<Partner>;
  deletePartner(id: string): Promise<void>;
  reorderPartners(ids: string[]): Promise<Partner[]>;

  getContact(): Promise<Contact>;
  updateContact(data: Partial<Contact>): Promise<Contact>;

  getFooter(): Promise<Footer>;
  updateFooter(data: Partial<Footer>): Promise<Footer>;
  createFooterService(data: Omit<FooterService, "id" | "order" | "createdAt" | "updatedAt">): Promise<FooterService>;
  updateFooterService(id: string, data: Partial<FooterService>): Promise<FooterService>;
  deleteFooterService(id: string): Promise<void>;
  reorderFooterServices(ids: string[]): Promise<FooterService[]>;
  createSocialLink(data: Omit<SocialLink, "id" | "order">): Promise<SocialLink>;
  updateSocialLink(id: string, data: Partial<SocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<void>;
  reorderSocialLinks(ids: string[]): Promise<SocialLink[]>;

  getMedia(page?: number, pageSize?: number, type?: MediaType): Promise<PaginatedResponse<MediaAsset>>;
  uploadMedia(file: File, altText?: string): Promise<MediaAsset>;
  updateMedia(id: string, data: Partial<MediaAsset>): Promise<MediaAsset>;
  deleteMedia(id: string): Promise<void>;
}
