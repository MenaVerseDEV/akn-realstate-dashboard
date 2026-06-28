"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { useAbout, useUpdateAbout } from "@/lib/hooks/use-cms";
import { aboutToFormValues } from "@/lib/api/mappers/about-us-section";
import { tags } from "@/lib/store";
import { toDisplayIcon } from "@/lib/icons";
import { aboutSchema } from "@/lib/schemas";
import type { About, AboutCard, AboutFormValues } from "@/lib/types";
import type { z } from "zod";
import { AboutCardForm } from "./AboutCardForm";

type FormValues = z.infer<typeof aboutSchema>;

const defaultValues: FormValues = {
  eyebrow: { ar: "" },
  title: { ar: "" },
  description: { ar: "" },
  imageUrl: null,
  imageFile: null,
};

function buildFormValues(about: About | undefined, cards: AboutCard[]): AboutFormValues {
  if (!about) {
    return { ...defaultValues, cards, imageFile: null };
  }
  return { ...aboutToFormValues(about), cards };
}

export default function AboutPage() {
  const { data, isLoading } = useAbout();
  const update = useUpdateAbout();
  const [cards, setCards] = useState<AboutCard[]>([]);

  useEffect(() => {
    if (data?.cards) setCards(data.cards);
  }, [data?.cards]);

  const formData: FormValues | undefined = data
    ? {
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        imageFile: null,
      }
    : undefined;

  const persistAbout = async (partial: Partial<AboutFormValues>) => {
    await update.mutateAsync({
      ...buildFormValues(data, cards),
      ...partial,
    });
  };

  const normalizeCards = (items: AboutCard[]) =>
    items.map((item, index) => ({ ...item, order: index }));

  const handleSaveCard = async (card: AboutCard, existingId?: string) => {
    const next = existingId
      ? cards.map((c) => (c.id === existingId ? { ...card, order: c.order } : c))
      : [...cards, card];
    await persistAbout({ cards: normalizeCards(next) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">من نحن</h2>
      <SingletonForm
        schema={aboutSchema}
        defaultValues={defaultValues}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync({
              ...values,
              cards,
            });
            toast.success("تم الحفظ");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <FormSection title="المحتوى">
            <LocalizedInput
              label="العنوان الفرعي"
              value={form.watch("eyebrow")}
              onChange={(v) => form.setValue("eyebrow", v, { shouldDirty: true })}
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
              label="الصورة"
              logoUrl={form.watch("imageUrl")}
              logoFile={form.watch("imageFile") ?? null}
              onLogoUrlChange={(url) => form.setValue("imageUrl", url, { shouldDirty: true })}
              onLogoFileChange={(file) => form.setValue("imageFile", file, { shouldDirty: true })}
            />
          </FormSection>
        )}
      </SingletonForm>

      <CollectionEditor
        title="البطاقات"
        items={cards}
        isLoading={isLoading}
        invalidateTags={tags.about}
        addLabel="إضافة بطاقة"
        reorderable
        getLabel={(item) => item.title.ar}
        columns={[
          {
            key: "icon",
            header: "الأيقونة",
            render: (i) => <Icon icon={toDisplayIcon(i.icon)} width={18} />,
          },
          { key: "title", header: "العنوان", render: (i) => i.title.ar },
        ]}
        onDelete={async (id) => {
          const next = normalizeCards(cards.filter((c) => c.id !== id));
          await persistAbout({ cards: next });
        }}
        onReorder={async (ids) => {
          const byId = new Map(cards.map((c) => [c.id, c]));
          const reordered = ids
            .map((id) => byId.get(id))
            .filter((c): c is AboutCard => Boolean(c));
          await persistAbout({ cards: normalizeCards(reordered) });
        }}
        renderForm={(item, onClose) => (
          <AboutCardForm item={item} onClose={onClose} onSave={handleSaveCard} />
        )}
      />
    </div>
  );
}
