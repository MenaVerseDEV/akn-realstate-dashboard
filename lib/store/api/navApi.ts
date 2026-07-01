import * as navApi from "@/lib/api/nav";
import type { NavLink, NavLinkFormValues } from "@/lib/types";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const navEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNav: builder.query<NavLink[], void>({
      queryFn: () => wrapQueryFn(navApi.list()),
      providesTags: ["Nav"],
    }),
    getNavById: builder.query<NavLink, string>({
      queryFn: (id) => wrapQueryFn(navApi.getById(id)),
      providesTags: (_result, _error, id) => [{ type: "Nav", id }],
    }),
    createNav: builder.mutation<NavLink, NavLinkFormValues>({
      queryFn: (body) => wrapQueryFn(navApi.create(body)),
      invalidatesTags: ["Nav"],
    }),
    updateNav: builder.mutation<NavLink, { id: string; body: NavLinkFormValues }>({
      queryFn: ({ id, body }) => wrapQueryFn(navApi.update(id, body)),
      invalidatesTags: ["Nav"],
    }),
    deleteNav: builder.mutation<void, string>({
      queryFn: (id) => wrapQueryFn(navApi.deleteNav(id)),
      invalidatesTags: ["Nav"],
    }),
    reorderNav: builder.mutation<NavLink[], string[]>({
      queryFn: (ids) => wrapQueryFn(navApi.reorder(ids)),
      invalidatesTags: ["Nav"],
    }),
  }),
});

export const {
  useListNavQuery,
  useGetNavByIdQuery,
  useCreateNavMutation,
  useUpdateNavMutation,
  useDeleteNavMutation,
  useReorderNavMutation,
} = navEndpoints;
