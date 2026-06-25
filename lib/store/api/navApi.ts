import * as navApi from "@/lib/api/nav";
import type { NavLink } from "@/lib/types";
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
  }),
});

export const { useListNavQuery, useGetNavByIdQuery } = navEndpoints;
