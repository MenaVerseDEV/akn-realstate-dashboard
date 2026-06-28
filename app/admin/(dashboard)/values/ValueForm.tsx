"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { IconPicker } from "@/components/cms/IconPicker";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as valuesApi from "@/lib/api/values";
import { useGetValueByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { valueSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { Value } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof valueSchema>;

const defaults: FormValues = {
  title: { ar: "" },
  description: { ar: "" },
  icon: "solar:shield-star-bold-duotone",
  color: "from-accent/10 to-accent/5",
};

type ValueFormProps = {
  item: Value | null;
  onClose: () => void;
  itemCount?: number;
};

export function ValueForm({ item, onClose, itemCount = 0 }: ValueFormProps) {
  const { data: hydratedItem, isLoading } = useGetValueByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={valueSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              title: editItem.title,
              description: editItem.description,
              icon: editItem.icon,
              color: editItem.color,
            }
          : null
      }
      invalidateTags={tags.values}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) {
          await valuesApi.update(editItem.id, values);
        } else {
          await valuesApi.create(values, itemCount + 1);
        }
      }}
    >
      {(form) => (
        <>
          <LocalizedInput
            label="العنوان"
            value={form.watch("title")}
            onChange={(v) => form.setValue("title", v)}
          />
          <LocalizedInput
            label="الوصف"
            value={form.watch("description")}
            onChange={(v) => form.setValue("description", v)}
            multiline
          />
          <div className="space-y-2">
            <Label>الأيقونة</Label>
            <IconPicker
              value={form.watch("icon")}
              onChange={(v) => form.setValue("icon", v, { shouldDirty: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>فئة اللون (Tailwind gradient)</Label>
            <Input {...form.register("color")} dir="ltr" className={ltrInputClass} />
          </div>
        </>
      )}
    </CollectionForm>
  );
}
