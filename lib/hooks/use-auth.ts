"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as session from "@/lib/auth/session";
import { clearAuth, setAuthStatus, setUser, useAppDispatch } from "@/lib/store";

export const queryKeys = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      dispatch(setAuthStatus("loading"));
      try {
        const user = await session.me();
        dispatch(setUser(user));
        return user;
      } catch (error) {
        dispatch(clearAuth());
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      session.login(email, password),
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => session.logout(),
    onSuccess: () => {
      dispatch(clearAuth());
      qc.clear();
    },
  });
}
