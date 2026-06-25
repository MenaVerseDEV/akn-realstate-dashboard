import { getApiClient } from "@/lib/api";
import * as footerApi from "@/lib/api/footer";
import type { Footer, FooterInfo, FooterInfoFormValues } from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

const api = getApiClient();

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
    getFooter: builder.query<Footer, void>({
      queryFn: () => wrapQueryFn(api.getFooter()),
      providesTags: ["Footer"],
    }),
    updateFooter: builder.mutation<Footer, Partial<Footer>>({
      queryFn: (body) => wrapQueryFn(api.updateFooter(body)),
      invalidatesTags: ["Footer"],
    }),
  }),
});

export const {
  useGetFooterInfoQuery,
  useUpdateFooterInfoMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,
} = footerEndpoints;
