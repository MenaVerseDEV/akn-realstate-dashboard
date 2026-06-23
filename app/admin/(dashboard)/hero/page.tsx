"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, queryKeys, useHero, useUpdateHero } from "@/lib/hooks/use-cms";
import { heroSchema } from "@/lib/schemas";
import { ltrInputClass, rtlInputClass } from "@/lib/i18n";
import type { HeroStat } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof heroSchema>;

export default function HeroPage() {
  const { data, isLoading } = useHero();
  const update = useUpdateHero();
  const qc = useQueryClient();
  const [deletingStat, setDeletingStat] = useState<HeroStat | null>(null);
  const [stats, setStats] = useState<HeroStat[]>([]);

  const formData: FormValues | undefined = data
    ? {
        badge: data.badge,
        title: data.title,
        description: data.description,
        primaryCtaLabel: data.primaryCtaLabel,
        primaryCtaHref: data.primaryCtaHref,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaHref: data.secondaryCtaHref,
        backgroundMediaUrl: data.backgroundMediaUrl,
      }
    : undefined;

  useEffect(() => {
    if (data?.stats) setStats(data.stats);
  }, [data?.stats]);

  const currentStats = stats.length ? stats : (data?.stats ?? []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">القسم الرئيسي</h2>
      <SingletonForm
        schema={heroSchema}
        defaultValues={{
          badge: { ar: "" },
          title: { ar: "" },
          description: { ar: "" },
          primaryCtaLabel: "",
          primaryCtaHref: "",
          secondaryCtaLabel: "",
          secondaryCtaHref: "",
          backgroundMediaUrl: null,
        }}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values);
            toast.success("تم حفظ القسم الرئيسي");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <>
            <FormSection title="المحتوى">
              <LocalizedInput label="الشارة" value={form.watch("badge")} onChange={(v) => form.setValue("badge", v, { shouldDirty: true })} />
              <LocalizedInput label="العنوان" value={form.watch("title")} onChange={(v) => form.setValue("title", v, { shouldDirty: true })} />
              <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v, { shouldDirty: true })} multiline />
              <MediaPicker label="خلفية" value={form.watch("backgroundMediaUrl")} onChange={(v) => form.setValue("backgroundMediaUrl", v, { shouldDirty: true })} />
            </FormSection>
            <FormSection title="أزرار الإجراء">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>الزر الأساسي — النص</Label>
                  <Input {...form.register("primaryCtaLabel")} dir="rtl" className={rtlInputClass} />
                </div>
                <div className="space-y-2">
                  <Label>الزر الأساسي — الرابط</Label>
                  <Input {...form.register("primaryCtaHref")} dir="ltr" className={ltrInputClass} />
                </div>
                <div className="space-y-2">
                  <Label>الزر الثانوي — النص</Label>
                  <Input {...form.register("secondaryCtaLabel")} dir="rtl" className={rtlInputClass} />
                </div>
                <div className="space-y-2">
                  <Label>الزر الثانوي — الرابط</Label>
                  <Input {...form.register("secondaryCtaHref")} dir="ltr" className={ltrInputClass} />
                </div>
              </div>
            </FormSection>
          </>
        )}
      </SingletonForm>

      <FormSection title="الإحصائيات" description="أرقام القسم الرئيسي">
        <ReorderableList
          items={currentStats}
          onReorder={async (reordered) => {
            setStats(reordered);
            await api.reorderHeroStats(reordered.map((s) => s.id));
            await qc.invalidateQueries({ queryKey: queryKeys.hero });
            toast.success("تم تحديث الترتيب");
          }}
          renderItem={(stat) => (
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon icon={stat.icon} width={20} />
                <span className="font-bold">{stat.value}{stat.suffix}</span>
                <span className="text-sm text-muted-foreground">{stat.label.ar}</span>
              </div>
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setDeletingStat(stat)}>
                <Icon icon="solar:trash-bin-trash-bold" width={16} className="text-destructive" />
              </Button>
            </div>
          )}
        />
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await api.createHeroStat({
              value: 0,
              suffix: "+",
              label: { ar: "إحصائية جديدة" },
              icon: "solar:star-bold",
            });
            await qc.invalidateQueries({ queryKey: queryKeys.hero });
            toast.success("تمت الإضافة");
          }}
        >
          إضافة إحصائية
        </Button>
      </FormSection>

      <ConfirmDeleteDialog
        open={!!deletingStat}
        onOpenChange={(open) => !open && setDeletingStat(null)}
        onConfirm={async () => {
          if (!deletingStat) return;
          await api.deleteHeroStat(deletingStat.id);
          await qc.invalidateQueries({ queryKey: queryKeys.hero });
          setDeletingStat(null);
          toast.success("تم الحذف");
        }}
      />
    </div>
  );
}
