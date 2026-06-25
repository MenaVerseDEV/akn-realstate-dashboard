import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api";
import * as settingsApi from "@/lib/api/settings";
import type { SiteSettingsFormValues } from "@/lib/types";

const api = getApiClient();

export const queryKeys = {
  settings: ["settings"] as const,
  nav: ["nav"] as const,
  hero: ["hero"] as const,
  about: ["about"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  projectMedia: (id: string) => ["projects", id, "media"] as const,
  milestones: ["milestones"] as const,
  video: ["video"] as const,
  values: ["values"] as const,
  features: ["features"] as const,
  partners: ["partners"] as const,
  contact: ["contact"] as const,
  footer: ["footer"] as const,
  media: (page: number, type?: string) => ["media", page, type] as const,
};

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: () => settingsApi.getSettings() });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SiteSettingsFormValues) => settingsApi.updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settings }),
  });
}

export function useNav() {
  return useQuery({ queryKey: queryKeys.nav, queryFn: () => api.getNav() });
}

export function useHero() {
  return useQuery({ queryKey: queryKeys.hero, queryFn: () => api.getHero() });
}

export function useUpdateHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateHero>[0]) => api.updateHero(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.hero }),
  });
}

export function useAbout() {
  return useQuery({ queryKey: queryKeys.about, queryFn: () => api.getAbout() });
}

export function useUpdateAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateAbout>[0]) => api.updateAbout(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.about }),
  });
}

export function useProjects() {
  return useQuery({ queryKey: queryKeys.projects, queryFn: () => api.getProjects() });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => api.getProject(id),
    enabled: !!id,
  });
}

export function useMilestones() {
  return useQuery({ queryKey: queryKeys.milestones, queryFn: () => api.getMilestones() });
}

export function useVideo() {
  return useQuery({ queryKey: queryKeys.video, queryFn: () => api.getVideo() });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateVideo>[0]) => api.updateVideo(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.video }),
  });
}

export function useValues() {
  return useQuery({ queryKey: queryKeys.values, queryFn: () => api.getValues() });
}

export function useFeatures() {
  return useQuery({ queryKey: queryKeys.features, queryFn: () => api.getFeatures() });
}

export function usePartners() {
  return useQuery({ queryKey: queryKeys.partners, queryFn: () => api.getPartners() });
}

export function useContact() {
  return useQuery({ queryKey: queryKeys.contact, queryFn: () => api.getContact() });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateContact>[0]) => api.updateContact(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.contact }),
  });
}

export function useFooter() {
  return useQuery({ queryKey: queryKeys.footer, queryFn: () => api.getFooter() });
}

export function useUpdateFooter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateFooter>[0]) => api.updateFooter(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.footer }),
  });
}

export function useMedia(page = 1, type?: "image" | "video") {
  return useQuery({
    queryKey: queryKeys.media(page, type),
    queryFn: () => api.getMedia(page, 20, type),
  });
}

export { api };
