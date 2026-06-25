"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/hooks/use-auth";
import { useAppSelector } from "@/lib/store";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isError } = useMe();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (isError) {
      router.replace("/admin/login");
    }
  }, [isError, router]);

  if (isLoading || status === "loading" || status === "idle") {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-sm text-muted-foreground">جاري تحميل الجلسة...</p>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return children;
}
