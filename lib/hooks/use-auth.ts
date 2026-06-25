"use client";

import { useGetMeQuery, useLoginMutation, useLogoutMutation } from "@/lib/store/api";

function wrapMutation<T extends (...args: never[]) => unknown>(
  useMutationHook: () => readonly [T, { isLoading: boolean; isError: boolean; isSuccess: boolean; error: unknown }],
) {
  return function useWrappedMutation() {
    const [mutateAsync, state] = useMutationHook();
    return {
      mutateAsync,
      mutate: mutateAsync,
      ...state,
      isPending: state.isLoading,
    };
  };
}

export function useMe() {
  return useGetMeQuery();
}

export const useLogin = wrapMutation(useLoginMutation);
export const useLogout = wrapMutation(useLogoutMutation);
