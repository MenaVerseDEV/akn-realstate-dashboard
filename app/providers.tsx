"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors dir="rtl" />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
