"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHero, useUpdateHero } from "@/lib/hooks/use-cms";
import { heroToFormValues } from "@/lib/api/mappers/hero-section";
import { tags } from "@/lib/store";
import { toDisplayIcon } from "@/lib/icons";
import { heroSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { Hero, HeroFormValues, HeroStat } from "@/lib/types";
import type { z } from "zod";
import { HeroStatForm } from "./HeroStatForm";

type FormValues = z.infer<typeof heroSchema>;

const defaultValues: FormValues = {
  badge: { ar: "" },
  title: { ar: "" },
  description: { ar: "" },
  primaryCtaLabel: { ar: "" },
  primaryCtaHref: "",
  secondaryCtaLabel: { ar: "" },
  secondaryCtaHref: "",
  backgroundMediaUrl: null,
  backgroundImageFile: null,
};

function buildFormValues(hero: Hero | undefined, stats: HeroStat[]): HeroFormValues {
  if (!hero) {
    return { ...defaultValues, stats, backgroundImageFile: null };
  }
  return { ...heroToFormValues(hero), stats };
}

export default function HeroPage() {
  const { data, isLoading } = useHero();
  const update = useUpdateHero();
  const [stats, setStats] = useState<HeroStat[]>([]);

  useEffect(() => {
    if (data?.stats) setStats(data.stats);
  }, [data?.stats]);

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
        backgroundImageFile: null,
      }
    : undefined;

  const persistHero = async (partial: Partial<HeroFormValues>) => {
    await update.mutateAsync({
      ...buildFormValues(data, stats),
      ...partial,
    });
  };

  const normalizeStats = (items: HeroStat[]) =>
    items.map((item, index) => ({ ...item, order: index }));

  const handleSaveStat = async (stat: HeroStat, existingId?: string) => {
    const next = existingId
      ? stats.map((s) => (s.id === existingId ? { ...stat, order: s.order } : s))
      : [...stats, stat];
    await persistHero({ stats: normalizeStats(next) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">القسم الرئيسي</h2>
      <SingletonForm
        schema={heroSchema}
        defaultValues={defaultValues}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync({
              ...values,
              stats,
            });
            toast.success("تم حفظ القسم الرئيسي");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <>
            <FormSection title="المحتوى">
              <LocalizedInput
                label="الشارة"
                value={form.watch("badge")}
                onChange={(v) => form.setValue("badge", v, { shouldDirty: true })}
              />
              <LocalizedInput
                label="العنوان"
                value={form.watch("title")}
                onChange={(v) => form.setValue("title", v, { shouldDirty: true })}
              />
              <LocalizedInput
                label="الوصف"
                value={form.watch("description")}
                onChange={(v) => form.setValue("description", v, { shouldDirty: true })}
                multiline
              />
              <LogoUploadField
                label="خلفية"
                logoUrl={form.watch("backgroundMediaUrl")}
                logoFile={form.watch("backgroundImageFile") ?? null}
                onLogoUrlChange={(url) =>
                  form.setValue("backgroundMediaUrl", url, { shouldDirty: true })
                }
                onLogoFileChange={(file) =>
                  form.setValue("backgroundImageFile", file, { shouldDirty: true })
                }
              />
            </FormSection>
            <FormSection title="أزرار الإجراء">
              <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedInput
                  label="الزر الأساسي — النص"
                  value={form.watch("primaryCtaLabel")}
                  onChange={(v) => form.setValue("primaryCtaLabel", v, { shouldDirty: true })}
                />
                <div className="space-y-2">
                  <Label>الزر الأساسي — الرابط</Label>
                  <Input
                    {...form.register("primaryCtaHref")}
                    dir="ltr"
                    className={ltrInputClass}
                  />
                </div>
                <LocalizedInput
                  label="الزر الثانوي — النص"
                  value={form.watch("secondaryCtaLabel")}
                  onChange={(v) => form.setValue("secondaryCtaLabel", v, { shouldDirty: true })}
                />
                <div className="space-y-2">
                  <Label>الزر الثانوي — الرابط</Label>
                  <Input
                    {...form.register("secondaryCtaHref")}
                    dir="ltr"
                    className={ltrInputClass}
                  />
                </div>
              </div>
            </FormSection>
          </>
        )}
      </SingletonForm>

      <CollectionEditor
        title="الإحصائيات"
        items={stats}
        isLoading={isLoading}
        invalidateTags={tags.hero}
        addLabel="إضافة إحصائية"
        reorderable
        getLabel={(item) => item.label.ar}
        columns={[
          {
            key: "icon",
            header: "الأيقونة",
            render: (i) => <Icon icon={toDisplayIcon(i.icon)} width={18} />,
          },
          {
            key: "value",
            header: "القيمة",
            render: (i) => `${i.value}${i.suffix}`,
          },
          { key: "label", header: "التسمية", render: (i) => i.label.ar },
        ]}
        onDelete={async (id) => {
          const next = normalizeStats(stats.filter((s) => s.id !== id));
          await persistHero({ stats: next });
        }}
        onReorder={async (ids) => {
          const byId = new Map(stats.map((s) => [s.id, s]));
          const reordered = ids
            .map((id) => byId.get(id))
            .filter((s): s is HeroStat => Boolean(s));
          await persistHero({ stats: normalizeStats(reordered) });
        }}
        renderForm={(item, onClose) => (
          <HeroStatForm item={item} onClose={onClose} onSave={handleSaveStat} />
        )}
      />
    </div>
  );
}
