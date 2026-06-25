import * as settingsApi from "@/lib/api/settings";
import type { SiteSettings, SiteSettingsFormValues } from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const settingsEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SiteSettings, void>({
      queryFn: () => wrapQueryFn(settingsApi.getSettings()),
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<SiteSettings, SiteSettingsFormValues>({
      queryFn: (body) => wrapQueryFn(settingsApi.updateSettings(body)),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsEndpoints;
