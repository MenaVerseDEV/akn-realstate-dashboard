import * as contactInquiriesApi from "@/lib/api/contact-inquiries";
import type {
  ContactInquiriesListParams,
  ContactInquiriesListResult,
  ContactInquiry,
  ContactInquiryStatusInput,
} from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const contactInquiriesEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactInquiries: builder.query<ContactInquiriesListResult, ContactInquiriesListParams>({
      queryFn: (params) => wrapQueryFn(contactInquiriesApi.list(params)),
      providesTags: ["ContactInquiries"],
    }),
    updateContactInquiryStatus: builder.mutation<
      ContactInquiry,
      { id: string; body: ContactInquiryStatusInput }
    >({
      queryFn: ({ id, body }) => wrapQueryFn(contactInquiriesApi.updateStatus(id, body)),
      invalidatesTags: ["ContactInquiries"],
    }),
  }),
});

export const { useGetContactInquiriesQuery, useUpdateContactInquiryStatusMutation } =
  contactInquiriesEndpoints;
