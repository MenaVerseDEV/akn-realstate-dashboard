"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { IconPicker } from "@/components/cms/IconPicker";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { tags } from "@/lib/store";
import { heroStatSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { HeroStat } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof heroStatSchema>;

const defaults: FormValues = {
  value: 0,
  suffix: "+",
  label: { ar: "" },
  icon: "solar:star-bold",
};

type HeroStatFormProps = {
  item: HeroStat | null;
  onClose: () => void;
  onSave: (stat: HeroStat, existingId?: string) => Promise<void>;
};

export function HeroStatForm({ item, onClose, onSave }: HeroStatFormProps) {
  return (
    <CollectionForm
      schema={heroStatSchema}
      defaultValues={defaults}
      item={
        item
          ? {
              value: item.value,
              suffix: item.suffix,
              label: item.label,
              icon: item.icon,
            }
          : null
      }
      invalidateTags={tags.hero}
      onClose={onClose}
      onSubmit={async (values) => {
        const stat: HeroStat = {
          id: item?.id ?? `stat-${Date.now()}`,
          value: values.value,
          suffix: values.suffix,
          label: values.label,
          icon: values.icon,
          order: item?.order ?? 0,
        };
        await onSave(stat, item?.id);
      }}
    >
      {(form) => (
        <>
          <LocalizedInput
            label="التسمية"
            value={form.watch("label")}
            onChange={(v) => form.setValue("label", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>القيمة</Label>
              <Input
                type="number"
                {...form.register("value", { valueAsNumber: true })}
                dir="ltr"
                className={ltrInputClass}
              />
            </div>
            <div className="space-y-2">
              <Label>اللاحقة</Label>
              <Input {...form.register("suffix")} placeholder="+" dir="ltr" className={ltrInputClass} />
            </div>
          </div>
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
