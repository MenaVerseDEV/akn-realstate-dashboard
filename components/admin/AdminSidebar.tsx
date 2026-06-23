"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { adminNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 right-0 z-40 flex h-full w-64 flex-col border-s border-border bg-bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex size-9 items-center justify-center bg-primary text-primary-foreground">
          <Icon icon="solar:buildings-2-bold" width={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-dark">أكن العقارية</p>
          <p className="text-xs text-muted-foreground">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {adminNavigation.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-dark hover:bg-bg-dark",
                      )}
                    >
                      <Icon icon={item.icon} width={18} />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
