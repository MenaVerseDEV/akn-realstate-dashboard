"use client";

import type { ProjectsListParams } from "@/lib/types";
import {
  useGetAboutQuery,
  useGetContactQuery,
  useGetFeaturesQuery,
  useGetFooterInfoQuery,
  useListFooterServicesQuery,
  useListFooterSocialLinksQuery,
  useGetHeroQuery,
  useGetMilestonesQuery,
  useGetPartnersQuery,
  useGetProjectQuery,
  useGetProjectMediaQuery,
  useGetProjectsQuery,
  useGetSettingsQuery,
  useGetValuesQuery,
  useGetVideoQuery,
  useListNavQuery,
  useUpdateAboutMutation,
  useUpdateContactMutation,
  useUpdateFooterInfoMutation,
  useUpdateHeroMutation,
  useUpdateSettingsMutation,
  useUpdateVideoMutation,
} from "@/lib/store/api";

function wrapMutation<T extends (...args: never[]) => unknown>(
  useMutationHook: () => readonly [T, { isLoading: boolean; isError: boolean; isSuccess: boolean; error: unknown }],
) {
  return function useWrappedMutation() {
    const [mutateAsync, state] = useMutationHook();
    return {
      mutateAsync,
      mutate: mutateAsync,
      ...state,
      isPending: state.isLoading,
    };
  };
}

export const useUpdateSettings = wrapMutation(useUpdateSettingsMutation);
export const useUpdateHero = wrapMutation(useUpdateHeroMutation);
export const useUpdateAbout = wrapMutation(useUpdateAboutMutation);
export const useUpdateVideo = wrapMutation(useUpdateVideoMutation);
export const useUpdateContact = wrapMutation(useUpdateContactMutation);
export const useUpdateFooterInfo = wrapMutation(useUpdateFooterInfoMutation);

export function useSettings() {
  return useGetSettingsQuery();
}

export function useNav() {
  return useListNavQuery();
}

export function useHero() {
  return useGetHeroQuery();
}

export function useAbout() {
  return useGetAboutQuery();
}

export function useProjects(params?: ProjectsListParams) {
  return useGetProjectsQuery(params ?? { page: 1, limit: 10 });
}

export function useProject(id: string) {
  return useGetProjectQuery(id, { skip: !id });
}

export function useProjectMedia(projectId: string) {
  return useGetProjectMediaQuery(projectId, { skip: !projectId });
}

export function useMilestones() {
  return useGetMilestonesQuery();
}

export function useVideo() {
  return useGetVideoQuery();
}

export function useValues() {
  return useGetValuesQuery();
}

export function useFeatures() {
  return useGetFeaturesQuery();
}

export function usePartners() {
  return useGetPartnersQuery();
}

export function useContact() {
  return useGetContactQuery();
}

export function useFooterServices() {
  return useListFooterServicesQuery();
}

export function useFooterSocialLinks() {
  return useListFooterSocialLinksQuery();
}

export function useFooterInfo() {
  return useGetFooterInfoQuery();
}
