"use client";

import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { IconPicker } from "@/components/cms/IconPicker";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { tags } from "@/lib/store";
import { aboutCardSchema } from "@/lib/schemas";
import type { AboutCard } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof aboutCardSchema>;

const defaults: FormValues = {
  title: { ar: "" },
  icon: "solar:star-bold",
};

type AboutCardFormProps = {
  item: AboutCard | null;
  onClose: () => void;
  onSave: (card: AboutCard, existingId?: string) => Promise<void>;
};

export function AboutCardForm({ item, onClose, onSave }: AboutCardFormProps) {
  return (
    <CollectionForm
      schema={aboutCardSchema}
      defaultValues={defaults}
      item={
        item
          ? {
              title: item.title,
              icon: item.icon,
            }
          : null
      }
      invalidateTags={tags.about}
      onClose={onClose}
      onSubmit={async (values) => {
        const card: AboutCard = {
          id: item?.id ?? `card-${Date.now()}`,
          title: values.title,
          icon: values.icon,
          order: item?.order ?? 0,
        };
        await onSave(card, item?.id);
      }}
    >
      {(form) => (
        <>
          <LocalizedInput
            label="العنوان"
            value={form.watch("title")}
            onChange={(v) => form.setValue("title", v)}
          />
          <div className="space-y-2">
            <Label>الأيقونة</Label>
            <IconPicker
              value={form.watch("icon")}
              onChange={(icon) => form.setValue("icon", icon, { shouldDirty: true })}
            />
          </div>
        </>
      )}
    </CollectionForm>
  );
}
