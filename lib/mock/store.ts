import { createSeedData, type SeedData } from "./seed";
import type {
  About,
  AboutCard,
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
  Partner,
  Project,
  ProjectMedia,
  SiteSettings,
  SocialLink,
  Value,
  VideoShowcase,
} from "@/lib/types";

let store: SeedData = createSeedData();

function touch() {
  return new Date().toISOString();
}

function reorder<T extends { id: string; order: number }>(items: T[], ids: string[]): T[] {
  const map = new Map(items.map((item) => [item.id, item]));
  return ids.map((id, index) => {
    const item = map.get(id);
    if (!item) throw new Error(`Item ${id} not found`);
    return { ...item, order: index };
  });
}

export function resetStore() {
  store = createSeedData();
}

export function getStore() {
  return store;
}

export const mockStore = {
  getSettings: () => store.settings,
  updateSettings: (data: Omit<SiteSettings, "id" | "createdAt" | "updatedAt">) => {
    store.settings = { ...store.settings, ...data, updatedAt: touch() };
    return store.settings;
  },

  getNav: () => [...store.nav].sort((a, b) => a.order - b.order),
  createNav: (data: Omit<NavLink, "id" | "order" | "createdAt" | "updatedAt">) => {
    const item: NavLink = {
      ...data,
      id: store.newId(),
      order: store.nav.length,
      createdAt: touch(),
      updatedAt: touch(),
    };
    store.nav.push(item);
    return item;
  },
  updateNav: (id: string, data: Partial<NavLink>) => {
    const idx = store.nav.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Not found");
    store.nav[idx] = { ...store.nav[idx], ...data, updatedAt: touch() };
    return store.nav[idx];
  },
  deleteNav: (id: string) => {
    store.nav = store.nav.filter((n) => n.id !== id);
  },
  reorderNav: (ids: string[]) => {
    store.nav = reorder(store.nav, ids);
    return mockStore.getNav();
  },

  getHero: () => store.hero,
  updateHero: (data: Partial<Hero>) => {
    store.hero = { ...store.hero, ...data, updatedAt: touch() };
    return store.hero;
  },
  createHeroStat: (data: Omit<HeroStat, "id" | "order">) => {
    const stat: HeroStat = { ...data, id: store.newId(), order: store.hero.stats.length };
    store.hero.stats.push(stat);
    store.hero.updatedAt = touch();
    return stat;
  },
  updateHeroStat: (id: string, data: Partial<HeroStat>) => {
    const idx = store.hero.stats.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Not found");
    store.hero.stats[idx] = { ...store.hero.stats[idx], ...data };
    store.hero.updatedAt = touch();
    return store.hero.stats[idx];
  },
  deleteHeroStat: (id: string) => {
    store.hero.stats = store.hero.stats.filter((s) => s.id !== id);
    store.hero.updatedAt = touch();
  },
  reorderHeroStats: (ids: string[]) => {
    store.hero.stats = reorder(store.hero.stats, ids);
    store.hero.updatedAt = touch();
    return store.hero.stats;
  },

  getAbout: () => store.about,
  updateAbout: (data: Partial<About>) => {
    store.about = { ...store.about, ...data, updatedAt: touch() };
    return store.about;
  },
  createAboutCard: (data: Omit<AboutCard, "id" | "order">) => {
    const card: AboutCard = { ...data, id: store.newId(), order: store.about.cards.length };
    store.about.cards.push(card);
    store.about.updatedAt = touch();
    return card;
  },
  updateAboutCard: (id: string, data: Partial<AboutCard>) => {
    const idx = store.about.cards.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Not found");
    store.about.cards[idx] = { ...store.about.cards[idx], ...data };
    store.about.updatedAt = touch();
    return store.about.cards[idx];
  },
  deleteAboutCard: (id: string) => {
    store.about.cards = store.about.cards.filter((c) => c.id !== id);
    store.about.updatedAt = touch();
  },
  reorderAboutCards: (ids: string[]) => {
    store.about.cards = reorder(store.about.cards, ids);
    store.about.updatedAt = touch();
    return store.about.cards;
  },

  getProjects: () => [...store.projects].sort((a, b) => a.slug.localeCompare(b.slug)),
  getProject: (id: string) => store.projects.find((p) => p.id === id),
  createProject: (data: Omit<Project, "id" | "media" | "createdAt" | "updatedAt">) => {
    const project: Project = {
      ...data,
      id: store.newId(),
      media: [],
      createdAt: touch(),
      updatedAt: touch(),
    };
    store.projects.push(project);
    return project;
  },
  updateProject: (id: string, data: Partial<Project>) => {
    const idx = store.projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Not found");
    store.projects[idx] = { ...store.projects[idx], ...data, updatedAt: touch() };
    return store.projects[idx];
  },
  deleteProject: (id: string) => {
    store.projects = store.projects.filter((p) => p.id !== id);
  },

  getProjectMedia: (projectId: string) => {
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Not found");
    return [...project.media].sort((a, b) => a.order - b.order);
  },
  addProjectMedia: (projectId: string, data: Omit<ProjectMedia, "id" | "order">) => {
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Not found");
    const media: ProjectMedia = { ...data, id: store.newId(), order: project.media.length };
    project.media.push(media);
    project.updatedAt = touch();
    return media;
  },
  updateProjectMedia: (projectId: string, mediaId: string, data: Partial<ProjectMedia>) => {
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Not found");
    const idx = project.media.findIndex((m) => m.id === mediaId);
    if (idx === -1) throw new Error("Not found");
    project.media[idx] = { ...project.media[idx], ...data };
    project.updatedAt = touch();
    return project.media[idx];
  },
  deleteProjectMedia: (projectId: string, mediaId: string) => {
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Not found");
    project.media = project.media.filter((m) => m.id !== mediaId);
    project.updatedAt = touch();
  },
  reorderProjectMedia: (projectId: string, ids: string[]) => {
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Not found");
    project.media = reorder(project.media, ids);
    project.updatedAt = touch();
    return project.media;
  },

  getMilestones: () => [...store.milestones].sort((a, b) => a.order - b.order),
  createMilestone: (data: Omit<Milestone, "id" | "order" | "createdAt" | "updatedAt">) => {
    const item: Milestone = { ...data, id: store.newId(), order: store.milestones.length, createdAt: touch(), updatedAt: touch() };
    store.milestones.push(item);
    return item;
  },
  updateMilestone: (id: string, data: Partial<Milestone>) => {
    const idx = store.milestones.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Not found");
    store.milestones[idx] = { ...store.milestones[idx], ...data, updatedAt: touch() };
    return store.milestones[idx];
  },
  deleteMilestone: (id: string) => {
    store.milestones = store.milestones.filter((m) => m.id !== id);
  },
  reorderMilestones: (ids: string[]) => {
    store.milestones = reorder(store.milestones, ids);
    return mockStore.getMilestones();
  },

  getVideo: () => store.video,
  updateVideo: (data: Partial<VideoShowcase>) => {
    store.video = { ...store.video, ...data, updatedAt: touch() };
    return store.video;
  },

  getValues: () => [...store.values].sort((a, b) => a.order - b.order),
  createValue: (data: Omit<Value, "id" | "order" | "createdAt" | "updatedAt">) => {
    const item: Value = { ...data, id: store.newId(), order: store.values.length, createdAt: touch(), updatedAt: touch() };
    store.values.push(item);
    return item;
  },
  updateValue: (id: string, data: Partial<Value>) => {
    const idx = store.values.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error("Not found");
    store.values[idx] = { ...store.values[idx], ...data, updatedAt: touch() };
    return store.values[idx];
  },
  deleteValue: (id: string) => {
    store.values = store.values.filter((v) => v.id !== id);
  },
  reorderValues: (ids: string[]) => {
    store.values = reorder(store.values, ids);
    return mockStore.getValues();
  },

  getFeatures: () => [...store.features].sort((a, b) => a.order - b.order),
  createFeature: (data: Omit<Feature, "id" | "order" | "createdAt" | "updatedAt">) => {
    const item: Feature = { ...data, id: store.newId(), order: store.features.length, createdAt: touch(), updatedAt: touch() };
    store.features.push(item);
    return item;
  },
  updateFeature: (id: string, data: Partial<Feature>) => {
    const idx = store.features.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("Not found");
    store.features[idx] = { ...store.features[idx], ...data, updatedAt: touch() };
    return store.features[idx];
  },
  deleteFeature: (id: string) => {
    store.features = store.features.filter((f) => f.id !== id);
  },
  reorderFeatures: (ids: string[]) => {
    store.features = reorder(store.features, ids);
    return mockStore.getFeatures();
  },

  getPartners: () => [...store.partners].sort((a, b) => a.order - b.order),
  createPartner: (data: Omit<Partner, "id" | "order" | "createdAt" | "updatedAt">) => {
    const item: Partner = { ...data, id: store.newId(), order: store.partners.length, createdAt: touch(), updatedAt: touch() };
    store.partners.push(item);
    return item;
  },
  updatePartner: (id: string, data: Partial<Partner>) => {
    const idx = store.partners.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Not found");
    store.partners[idx] = { ...store.partners[idx], ...data, updatedAt: touch() };
    return store.partners[idx];
  },
  deletePartner: (id: string) => {
    store.partners = store.partners.filter((p) => p.id !== id);
  },
  reorderPartners: (ids: string[]) => {
    store.partners = reorder(store.partners, ids);
    return mockStore.getPartners();
  },

  getContact: () => store.contact,
  updateContact: (data: Partial<Contact>) => {
    store.contact = { ...store.contact, ...data, updatedAt: touch() };
    return store.contact;
  },

  getFooter: () => store.footer,
  updateFooter: (data: Partial<Footer>) => {
    store.footer = { ...store.footer, ...data, updatedAt: touch() };
    return store.footer;
  },
  createFooterService: (data: Omit<FooterService, "id" | "order" | "createdAt" | "updatedAt">) => {
    const now = touch();
    const service: FooterService = {
      ...data,
      id: store.newId(),
      order: store.footer.services.length,
      createdAt: now,
      updatedAt: now,
    };
    store.footer.services.push(service);
    store.footer.updatedAt = touch();
    return service;
  },
  updateFooterService: (id: string, data: Partial<FooterService>) => {
    const idx = store.footer.services.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Not found");
    store.footer.services[idx] = { ...store.footer.services[idx], ...data };
    store.footer.updatedAt = touch();
    return store.footer.services[idx];
  },
  deleteFooterService: (id: string) => {
    store.footer.services = store.footer.services.filter((s) => s.id !== id);
    store.footer.updatedAt = touch();
  },
  reorderFooterServices: (ids: string[]) => {
    store.footer.services = reorder(store.footer.services, ids);
    store.footer.updatedAt = touch();
    return store.footer.services;
  },
  createSocialLink: (data: Omit<SocialLink, "id" | "order">) => {
    const link: SocialLink = { ...data, id: store.newId(), order: store.footer.socials.length };
    store.footer.socials.push(link);
    store.footer.updatedAt = touch();
    return link;
  },
  updateSocialLink: (id: string, data: Partial<SocialLink>) => {
    const idx = store.footer.socials.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Not found");
    store.footer.socials[idx] = { ...store.footer.socials[idx], ...data };
    store.footer.updatedAt = touch();
    return store.footer.socials[idx];
  },
  deleteSocialLink: (id: string) => {
    store.footer.socials = store.footer.socials.filter((s) => s.id !== id);
    store.footer.updatedAt = touch();
  },
  reorderSocialLinks: (ids: string[]) => {
    store.footer.socials = reorder(store.footer.socials, ids);
    store.footer.updatedAt = touch();
    return store.footer.socials;
  },

  getMedia: (page = 1, pageSize = 20, type?: MediaType) => {
    let items = [...store.media];
    if (type) items = items.filter((m) => m.type === type);
    const total = items.length;
    const start = (page - 1) * pageSize;
    return { data: items.slice(start, start + pageSize), total, page, pageSize };
  },
  getMediaById: (id: string) => store.media.find((m) => m.id === id),
  createMedia: (data: Omit<MediaAsset, "id" | "createdAt" | "updatedAt">) => {
    const asset: MediaAsset = { ...data, id: store.newId(), createdAt: touch(), updatedAt: touch() };
    store.media.unshift(asset);
    return asset;
  },
  updateMedia: (id: string, data: Partial<MediaAsset>) => {
    const idx = store.media.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Not found");
    store.media[idx] = { ...store.media[idx], ...data, updatedAt: touch() };
    return store.media[idx];
  },
  deleteMedia: (id: string) => {
    const referenced = store.projects.some((p) => p.media.some((m) => {
      const asset = store.media.find((a) => a.id === id);
      return asset && m.url === asset.url;
    }));
    if (referenced) throw new Error("Media is still referenced");
    store.media = store.media.filter((m) => m.id !== id);
  },

  setAuthToken: (token: string | null) => {
    store.authToken = token;
  },
  getAuthToken: () => store.authToken,
};
