import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminNavigation } from "@/lib/navigation";

export default function AdminOverviewPage() {
  const modules = adminNavigation.flatMap((g) => g.items);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark">مرحباً بك</h2>
        <p className="text-muted-foreground">اختر قسماً لتحرير محتوى الموقع</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="rounded-none transition-colors hover:border-primary/40 hover:bg-bg-dark/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center bg-primary/10 text-primary">
                  <Icon icon={item.icon} width={22} />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">تحرير المحتوى</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
