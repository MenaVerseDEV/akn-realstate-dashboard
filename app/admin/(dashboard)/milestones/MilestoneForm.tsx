"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { IconPicker } from "@/components/cms/IconPicker";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as aspirationsApi from "@/lib/api/aspirations";
import { useGetMilestoneByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { milestoneSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { Milestone } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof milestoneSchema>;

const defaults: FormValues = {
  year: "",
  title: { ar: "" },
  description: { ar: "" },
  icon: "solar:flag-bold-duotone",
};

type MilestoneFormProps = {
  item: Milestone | null;
  onClose: () => void;
  itemCount?: number;
};

export function MilestoneForm({ item, onClose, itemCount = 0 }: MilestoneFormProps) {
  const { data: hydratedItem, isLoading } = useGetMilestoneByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={milestoneSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              year: editItem.year,
              title: editItem.title,
              description: editItem.description,
              icon: editItem.icon,
            }
          : null
      }
      invalidateTags={tags.milestones}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) {
          await aspirationsApi.update(editItem.id, values);
        } else {
          await aspirationsApi.create(values, itemCount + 1);
        }
      }}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>السنة</Label>
            <Input
              {...form.register("year")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="2030"
            />
          </div>
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
