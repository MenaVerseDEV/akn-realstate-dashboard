import * as footerApi from "@/lib/api/footer";
import * as footerServicesApi from "@/lib/api/footer-services";
import * as footerSocialLinksApi from "@/lib/api/footer-social-links";
import type { FooterInfo, FooterInfoFormValues, FooterService, SocialLink } from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const footerEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFooterInfo: builder.query<FooterInfo, void>({
      queryFn: () => wrapQueryFn(footerApi.getFooterInfo()),
      providesTags: ["FooterInfo"],
    }),
    updateFooterInfo: builder.mutation<FooterInfo, FooterInfoFormValues>({
      queryFn: (body) => wrapQueryFn(footerApi.updateFooterInfo(body)),
      invalidatesTags: ["FooterInfo"],
    }),
    listFooterServices: builder.query<FooterService[], void>({
      queryFn: () => wrapQueryFn(footerServicesApi.list()),
      providesTags: ["FooterServices"],
    }),
    getFooterServiceById: builder.query<FooterService, string>({
      queryFn: (id) => wrapQueryFn(footerServicesApi.getById(id)),
      providesTags: ["FooterServices"],
    }),
    listFooterSocialLinks: builder.query<SocialLink[], void>({
      queryFn: () => wrapQueryFn(footerSocialLinksApi.list()),
      providesTags: ["FooterSocialLinks"],
    }),
    getFooterSocialLinkById: builder.query<SocialLink, string>({
      queryFn: (id) => wrapQueryFn(footerSocialLinksApi.getById(id)),
      providesTags: ["FooterSocialLinks"],
    }),
  }),
});

export const {
  useGetFooterInfoQuery,
  useUpdateFooterInfoMutation,
  useListFooterServicesQuery,
  useGetFooterServiceByIdQuery,
  useListFooterSocialLinksQuery,
  useGetFooterSocialLinkByIdQuery,
} = footerEndpoints;
