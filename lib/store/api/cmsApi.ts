import { getApiClient } from "@/lib/api";
import type {
  About,
  Contact,
  Feature,
  Footer,
  Hero,
  MediaAsset,
  Milestone,
  PaginatedResponse,
  Partner,
  Project,
  Value,
  VideoShowcase,
} from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

const api = getApiClient();

export const cmsEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHero: builder.query<Hero, void>({
      queryFn: () => wrapQueryFn(api.getHero()),
      providesTags: ["Hero"],
    }),
    updateHero: builder.mutation<Hero, Partial<Hero>>({
      queryFn: (body) => wrapQueryFn(api.updateHero(body)),
      invalidatesTags: ["Hero"],
    }),
    getAbout: builder.query<About, void>({
      queryFn: () => wrapQueryFn(api.getAbout()),
      providesTags: ["About"],
    }),
    updateAbout: builder.mutation<About, Partial<About>>({
      queryFn: (body) => wrapQueryFn(api.updateAbout(body)),
      invalidatesTags: ["About"],
    }),
    getProjects: builder.query<Project[], void>({
      queryFn: () => wrapQueryFn(api.getProjects()),
      providesTags: ["Projects"],
    }),
    getProject: builder.query<Project, string>({
      queryFn: (id) => wrapQueryFn(api.getProject(id)),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    getMilestones: builder.query<Milestone[], void>({
      queryFn: () => wrapQueryFn(api.getMilestones()),
      providesTags: ["Milestones"],
    }),
    getVideo: builder.query<VideoShowcase, void>({
      queryFn: () => wrapQueryFn(api.getVideo()),
      providesTags: ["Video"],
    }),
    updateVideo: builder.mutation<VideoShowcase, Partial<VideoShowcase>>({
      queryFn: (body) => wrapQueryFn(api.updateVideo(body)),
      invalidatesTags: ["Video"],
    }),
    getValues: builder.query<Value[], void>({
      queryFn: () => wrapQueryFn(api.getValues()),
      providesTags: ["Values"],
    }),
    getFeatures: builder.query<Feature[], void>({
      queryFn: () => wrapQueryFn(api.getFeatures()),
      providesTags: ["Features"],
    }),
    getPartners: builder.query<Partner[], void>({
      queryFn: () => wrapQueryFn(api.getPartners()),
      providesTags: ["Partners"],
    }),
    getContact: builder.query<Contact, void>({
      queryFn: () => wrapQueryFn(api.getContact()),
      providesTags: ["Contact"],
    }),
    updateContact: builder.mutation<Contact, Partial<Contact>>({
      queryFn: (body) => wrapQueryFn(api.updateContact(body)),
      invalidatesTags: ["Contact"],
    }),
    getMedia: builder.query<
      PaginatedResponse<MediaAsset>,
      { page?: number; type?: "image" | "video" }
    >({
      queryFn: ({ page = 1, type }) => wrapQueryFn(api.getMedia(page, 20, type)),
      providesTags: ["Media"],
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
  useGetMilestonesQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
  useGetValuesQuery,
  useGetFeaturesQuery,
  useGetPartnersQuery,
  useGetContactQuery,
  useUpdateContactMutation,
  useGetMediaQuery,
} = cmsEndpoints;

export { api };
