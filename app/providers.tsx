"use client";

import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster position="top-right" richColors dir="rtl" />
    </ReduxProvider>
  );
}
