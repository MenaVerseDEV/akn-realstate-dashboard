import * as session from "@/lib/auth/session";
import type { AuthResponse, User } from "@/lib/types";
import { clearAuth, setAuthStatus, setUser } from "../slices/authSlice";
import { baseApi } from "./baseApi";
import { wrapQueryFn } from "./queryFn";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      queryFn: () => wrapQueryFn(session.me()),
      keepUnusedDataFor: 300,
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthStatus("loading"));
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearAuth());
        }
      },
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      queryFn: ({ email, password }) => wrapQueryFn(session.login(email, password)),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          // login page handles error
        }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => wrapQueryFn(session.logout()),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
          dispatch(baseApi.util.resetApiState());
        } catch {
          // logout page handles error
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi;
