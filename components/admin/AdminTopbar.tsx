"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogout, useSettings } from "@/lib/hooks/use-cms";

export function AdminTopbar() {
  const router = useRouter();
  const { data: settings } = useSettings();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("تم تسجيل الخروج");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-card/90 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-bold text-dark">
          {settings?.siteName.ar ?? "أكن العقارية"}
        </h1>
        <p className="text-xs text-muted-foreground">إدارة محتوى الموقع</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="https://akn.sa" target="_blank" rel="noopener noreferrer">
            <Icon icon="solar:eye-bold" width={16} />
            عرض الموقع
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <Icon icon="solar:logout-2-bold" width={16} />
          خروج
        </Button>
      </div>
    </header>
  );
}
