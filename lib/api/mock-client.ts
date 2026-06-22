import { mockStore } from "@/lib/mock/store";
import {
  AUTH_COOKIE,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  type AuthResponse,
  type MediaAsset,
  type MediaType,
  type User,
} from "@/lib/types";
import type { ApiClient } from "./client";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function getToken(): string | null {
  if (typeof document === "undefined") return mockStore.getAuthToken();
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setToken(token: string | null) {
  mockStore.setAuthToken(token);
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  }
}

function requireAuth() {
  if (!getToken()) throw new Error("Unauthorized");
}

const demoUser: User = { id: "u_1", email: DEMO_EMAIL, role: "admin" };

export const mockApiClient: ApiClient = {
  async login(email, password) {
    await delay();
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error("بيانات الدخول غير صحيحة");
    }
    const response: AuthResponse = {
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
      user: demoUser,
    };
    setToken(response.accessToken);
    return response;
  },

  async logout() {
    await delay(100);
    setToken(null);
  },

  async me() {
    await delay(100);
    requireAuth();
    return demoUser;
  },

  async getSettings() {
    await delay();
    requireAuth();
    return mockStore.getSettings();
  },
  async updateSettings(data) {
    await delay();
    requireAuth();
    return mockStore.updateSettings(data as Parameters<typeof mockStore.updateSettings>[0]);
  },

  async getNav() {
    await delay();
    requireAuth();
    return mockStore.getNav();
  },
  async createNav(data) {
    await delay();
    requireAuth();
    return mockStore.createNav(data);
  },
  async updateNav(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateNav(id, data);
  },
  async deleteNav(id) {
    await delay();
    requireAuth();
    mockStore.deleteNav(id);
  },
  async reorderNav(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderNav(ids);
  },

  async getHero() {
    await delay();
    requireAuth();
    return mockStore.getHero();
  },
  async updateHero(data) {
    await delay();
    requireAuth();
    return mockStore.updateHero(data);
  },
  async createHeroStat(data) {
    await delay();
    requireAuth();
    return mockStore.createHeroStat(data);
  },
  async updateHeroStat(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateHeroStat(id, data);
  },
  async deleteHeroStat(id) {
    await delay();
    requireAuth();
    mockStore.deleteHeroStat(id);
  },
  async reorderHeroStats(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderHeroStats(ids);
  },

  async getAbout() {
    await delay();
    requireAuth();
    return mockStore.getAbout();
  },
  async updateAbout(data) {
    await delay();
    requireAuth();
    return mockStore.updateAbout(data);
  },
  async createAboutCard(data) {
    await delay();
    requireAuth();
    return mockStore.createAboutCard(data);
  },
  async updateAboutCard(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateAboutCard(id, data);
  },
  async deleteAboutCard(id) {
    await delay();
    requireAuth();
    mockStore.deleteAboutCard(id);
  },
  async reorderAboutCards(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderAboutCards(ids);
  },

  async getProjects() {
    await delay();
    requireAuth();
    return mockStore.getProjects();
  },
  async getProject(id) {
    await delay();
    requireAuth();
    const project = mockStore.getProject(id);
    if (!project) throw new Error("Not found");
    return project;
  },
  async createProject(data) {
    await delay();
    requireAuth();
    return mockStore.createProject(data);
  },
  async updateProject(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateProject(id, data);
  },
  async deleteProject(id) {
    await delay();
    requireAuth();
    mockStore.deleteProject(id);
  },

  async getProjectMedia(projectId) {
    await delay();
    requireAuth();
    return mockStore.getProjectMedia(projectId);
  },
  async addProjectMedia(projectId, data) {
    await delay();
    requireAuth();
    return mockStore.addProjectMedia(projectId, data);
  },
  async updateProjectMedia(projectId, mediaId, data) {
    await delay();
    requireAuth();
    return mockStore.updateProjectMedia(projectId, mediaId, data);
  },
  async deleteProjectMedia(projectId, mediaId) {
    await delay();
    requireAuth();
    mockStore.deleteProjectMedia(projectId, mediaId);
  },
  async reorderProjectMedia(projectId, ids) {
    await delay();
    requireAuth();
    return mockStore.reorderProjectMedia(projectId, ids);
  },

  async getMilestones() {
    await delay();
    requireAuth();
    return mockStore.getMilestones();
  },
  async createMilestone(data) {
    await delay();
    requireAuth();
    return mockStore.createMilestone(data);
  },
  async updateMilestone(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateMilestone(id, data);
  },
  async deleteMilestone(id) {
    await delay();
    requireAuth();
    mockStore.deleteMilestone(id);
  },
  async reorderMilestones(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderMilestones(ids);
  },

  async getVideo() {
    await delay();
    requireAuth();
    return mockStore.getVideo();
  },
  async updateVideo(data) {
    await delay();
    requireAuth();
    return mockStore.updateVideo(data);
  },

  async getValues() {
    await delay();
    requireAuth();
    return mockStore.getValues();
  },
  async createValue(data) {
    await delay();
    requireAuth();
    return mockStore.createValue(data);
  },
  async updateValue(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateValue(id, data);
  },
  async deleteValue(id) {
    await delay();
    requireAuth();
    mockStore.deleteValue(id);
  },
  async reorderValues(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderValues(ids);
  },

  async getFeatures() {
    await delay();
    requireAuth();
    return mockStore.getFeatures();
  },
  async createFeature(data) {
    await delay();
    requireAuth();
    return mockStore.createFeature(data);
  },
  async updateFeature(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateFeature(id, data);
  },
  async deleteFeature(id) {
    await delay();
    requireAuth();
    mockStore.deleteFeature(id);
  },
  async reorderFeatures(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderFeatures(ids);
  },

  async getPartners() {
    await delay();
    requireAuth();
    return mockStore.getPartners();
  },
  async createPartner(data) {
    await delay();
    requireAuth();
    return mockStore.createPartner(data);
  },
  async updatePartner(id, data) {
    await delay();
    requireAuth();
    return mockStore.updatePartner(id, data);
  },
  async deletePartner(id) {
    await delay();
    requireAuth();
    mockStore.deletePartner(id);
  },
  async reorderPartners(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderPartners(ids);
  },

  async getContact() {
    await delay();
    requireAuth();
    return mockStore.getContact();
  },
  async updateContact(data) {
    await delay();
    requireAuth();
    return mockStore.updateContact(data);
  },

  async getFooter() {
    await delay();
    requireAuth();
    return mockStore.getFooter();
  },
  async updateFooter(data) {
    await delay();
    requireAuth();
    return mockStore.updateFooter(data);
  },
  async createFooterService(data) {
    await delay();
    requireAuth();
    return mockStore.createFooterService(data);
  },
  async updateFooterService(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateFooterService(id, data);
  },
  async deleteFooterService(id) {
    await delay();
    requireAuth();
    mockStore.deleteFooterService(id);
  },
  async reorderFooterServices(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderFooterServices(ids);
  },
  async createSocialLink(data) {
    await delay();
    requireAuth();
    return mockStore.createSocialLink(data);
  },
  async updateSocialLink(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateSocialLink(id, data);
  },
  async deleteSocialLink(id) {
    await delay();
    requireAuth();
    mockStore.deleteSocialLink(id);
  },
  async reorderSocialLinks(ids) {
    await delay();
    requireAuth();
    return mockStore.reorderSocialLinks(ids);
  },

  async getMedia(page = 1, pageSize = 20, type?: MediaType) {
    await delay();
    requireAuth();
    return mockStore.getMedia(page, pageSize, type);
  },
  async uploadMedia(file, altText) {
    await delay(400);
    requireAuth();
    const url = URL.createObjectURL(file);
    const asset: Omit<MediaAsset, "id" | "createdAt" | "updatedAt"> = {
      url,
      type: file.type.startsWith("video") ? "video" : "image",
      altText: altText ? { ar: altText } : null,
      width: null,
      height: null,
      size: file.size,
    };
    return mockStore.createMedia(asset);
  },
  async updateMedia(id, data) {
    await delay();
    requireAuth();
    return mockStore.updateMedia(id, data);
  },
  async deleteMedia(id) {
    await delay();
    requireAuth();
    try {
      mockStore.deleteMedia(id);
    } catch {
      throw new Error("لا يمكن حذف الوسائط المستخدمة في مشروع");
    }
  },
};

export function getApiClient(): ApiClient {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
  if (useMock) return mockApiClient;
  throw new Error("HttpApiClient not implemented yet");
}
