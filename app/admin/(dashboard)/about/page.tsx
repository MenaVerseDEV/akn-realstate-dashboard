"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { api, queryKeys, useAbout, useUpdateAbout } from "@/lib/hooks/use-cms";
import { aboutSchema } from "@/lib/schemas";
import type { AboutCard } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof aboutSchema>;

export default function AboutPage() {
  const { data, isLoading } = useAbout();
  const update = useUpdateAbout();
  const qc = useQueryClient();
  const [deletingCard, setDeletingCard] = useState<AboutCard | null>(null);

  const formData: FormValues | undefined = data
    ? {
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">من نحن</h2>
      <SingletonForm
        schema={aboutSchema}
        defaultValues={{
          eyebrow: { ar: "" },
          title: { ar: "" },
          description: { ar: "" },
          imageUrl: null,
        }}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values);
            toast.success("تم الحفظ");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <FormSection title="المحتوى">
            <LocalizedInput label="العنوان الفرعي" value={form.watch("eyebrow")} onChange={(v) => form.setValue("eyebrow", v, { shouldDirty: true })} />
            <LocalizedInput label="العنوان" value={form.watch("title")} onChange={(v) => form.setValue("title", v, { shouldDirty: true })} />
            <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v, { shouldDirty: true })} multiline />
            <MediaPicker label="الصورة" value={form.watch("imageUrl")} onChange={(v) => form.setValue("imageUrl", v, { shouldDirty: true })} />
          </FormSection>
        )}
      </SingletonForm>

      <FormSection title="البطاقات">
        <ReorderableList
          items={data?.cards ?? []}
          onReorder={async (reordered) => {
            await api.reorderAboutCards(reordered.map((c) => c.id));
            await qc.invalidateQueries({ queryKey: queryKeys.about });
            toast.success("تم تحديث الترتيب");
          }}
          renderItem={(card) => (
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon icon={card.icon} width={20} />
                <span className="font-medium">{card.title.ar}</span>
              </div>
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setDeletingCard(card)}>
                <Icon icon="solar:trash-bin-trash-bold" width={16} className="text-destructive" />
              </Button>
            </div>
          )}
        />
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await api.createAboutCard({
              title: { ar: "بطاقة جديدة" },
              description: { ar: "وصف البطاقة" },
              icon: "solar:star-bold",
            });
            await qc.invalidateQueries({ queryKey: queryKeys.about });
            toast.success("تمت الإضافة");
          }}
        >
          إضافة بطاقة
        </Button>
      </FormSection>

      <ConfirmDeleteDialog
        open={!!deletingCard}
        onOpenChange={(open) => !open && setDeletingCard(null)}
        onConfirm={async () => {
          if (!deletingCard) return;
          await api.deleteAboutCard(deletingCard.id);
          await qc.invalidateQueries({ queryKey: queryKeys.about });
          setDeletingCard(null);
          toast.success("تم الحذف");
        }}
      />
    </div>
  );
}
