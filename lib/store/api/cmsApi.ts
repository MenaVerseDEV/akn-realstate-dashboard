import * as aboutApi from "@/lib/api/about";
import * as aspirationsApi from "@/lib/api/aspirations";
import * as valuesApi from "@/lib/api/values";
import * as featuresApi from "@/lib/api/features";
import * as partnersApi from "@/lib/api/partners";
import * as contactApi from "@/lib/api/contact";
import * as videoApi from "@/lib/api/video";
import * as projectsApi from "@/lib/api/projects";
import * as projectUnitsApi from "@/lib/api/project-units";
import * as heroApi from "@/lib/api/hero";
import type {
  About,
  AboutFormValues,
  Contact,
  ContactUsSectionInput,
  Feature,
  Hero,
  HeroFormValues,
  Milestone,
  Partner,
  Project,
  ProjectMedia,
  ProjectUnitsListParams,
  ProjectUnitsListResult,
  ProjectsListParams,
  ProjectsListResult,
  Value,
  VideoShowcase,
  VideoSectionFormValues,
} from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const cmsEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHero: builder.query<Hero, void>({
      queryFn: () => wrapQueryFn(heroApi.getHero()),
      providesTags: ["Hero"],
    }),
    updateHero: builder.mutation<Hero, HeroFormValues>({
      queryFn: (body) => wrapQueryFn(heroApi.updateHero(body)),
      invalidatesTags: ["Hero"],
    }),
    getAbout: builder.query<About, void>({
      queryFn: () => wrapQueryFn(aboutApi.getAbout()),
      providesTags: ["About"],
    }),
    updateAbout: builder.mutation<About, AboutFormValues>({
      queryFn: (body) => wrapQueryFn(aboutApi.updateAbout(body)),
      invalidatesTags: ["About"],
    }),
    getProjects: builder.query<ProjectsListResult, ProjectsListParams>({
      queryFn: (params) => wrapQueryFn(projectsApi.list(params)),
      providesTags: ["Projects"],
    }),
    getProject: builder.query<Project, string>({
      queryFn: (id) => wrapQueryFn(projectsApi.getById(id)),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    getProjectMedia: builder.query<ProjectMedia[], string>({
      queryFn: (projectId) => wrapQueryFn(projectsApi.listMedia(projectId)),
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: projectId }],
    }),
    getProjectUnits: builder.query<
      ProjectUnitsListResult,
      { projectId: string; params?: ProjectUnitsListParams }
    >({
      queryFn: ({ projectId, params }) =>
        wrapQueryFn(projectUnitsApi.list(projectId, params)),
      providesTags: (_result, _error, { projectId }) => [{ type: "Project", id: projectId }],
    }),
    getMilestones: builder.query<Milestone[], void>({
      queryFn: () => wrapQueryFn(aspirationsApi.list()),
      providesTags: ["Milestones"],
    }),
    getMilestoneById: builder.query<Milestone, string>({
      queryFn: (id) => wrapQueryFn(aspirationsApi.getById(id)),
      providesTags: ["Milestones"],
    }),
    getVideo: builder.query<VideoShowcase, void>({
      queryFn: () => wrapQueryFn(videoApi.getVideo()),
      providesTags: ["Video"],
    }),
    updateVideo: builder.mutation<VideoShowcase, VideoSectionFormValues>({
      queryFn: (body) => wrapQueryFn(videoApi.updateVideo(body)),
      invalidatesTags: ["Video"],
    }),
    getValues: builder.query<Value[], void>({
      queryFn: () => wrapQueryFn(valuesApi.list()),
      providesTags: ["Values"],
    }),
    getValueById: builder.query<Value, string>({
      queryFn: (id) => wrapQueryFn(valuesApi.getById(id)),
      providesTags: ["Values"],
    }),
    getFeatures: builder.query<Feature[], void>({
      queryFn: () => wrapQueryFn(featuresApi.list()),
      providesTags: ["Features"],
    }),
    getFeatureById: builder.query<Feature, string>({
      queryFn: (id) => wrapQueryFn(featuresApi.getById(id)),
      providesTags: ["Features"],
    }),
    getPartners: builder.query<Partner[], void>({
      queryFn: () => wrapQueryFn(partnersApi.list()),
      providesTags: ["Partners"],
    }),
    getPartnerById: builder.query<Partner, string>({
      queryFn: (id) => wrapQueryFn(partnersApi.getById(id)),
      providesTags: ["Partners"],
    }),
    getContact: builder.query<Contact, void>({
      queryFn: () => wrapQueryFn(contactApi.getContact()),
      providesTags: ["Contact"],
    }),
    updateContact: builder.mutation<Contact, ContactUsSectionInput>({
      queryFn: (body) => wrapQueryFn(contactApi.updateContact(body)),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useGetHeroQuery,
  useUpdateHeroMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectMediaQuery,
  useGetProjectUnitsQuery,
  useGetMilestonesQuery,
  useGetMilestoneByIdQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
  useGetValuesQuery,
  useGetValueByIdQuery,
  useGetFeaturesQuery,
  useGetFeatureByIdQuery,
  useGetPartnersQuery,
  useGetPartnerByIdQuery,
  useGetContactQuery,
  useUpdateContactMutation,
} = cmsEndpoints;
