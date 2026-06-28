"use client";

import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { IconPicker } from "@/components/cms/IconPicker";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as featuresApi from "@/lib/api/features";
import { useGetFeatureByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { featureSchema } from "@/lib/schemas";
import type { Feature } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof featureSchema>;

const defaults: FormValues = {
  title: { ar: "" },
  description: { ar: "" },
  icon: "solar:star-bold",
};

type FeatureFormProps = {
  item: Feature | null;
  onClose: () => void;
  itemCount?: number;
};

export function FeatureForm({ item, onClose, itemCount = 0 }: FeatureFormProps) {
  const { data: hydratedItem, isLoading } = useGetFeatureByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={featureSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              title: editItem.title,
              description: editItem.description,
              icon: editItem.icon,
            }
          : null
      }
      invalidateTags={tags.features}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) {
          await featuresApi.update(editItem.id, values);
        } else {
          await featuresApi.create(values, itemCount + 1);
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
        </>
      )}
    </CollectionForm>
  );
}
