"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { IconPicker } from "@/components/cms/IconPicker";
import { api, useValues } from "@/lib/hooks/use-cms";
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

export default function ValuesPage() {
  const { data: items = [], isLoading } = useValues();

  return (
    <CollectionEditor<Value>
      title="القيم"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.values}
      addLabel="إضافة قيمة"
      reorderable
      getLabel={(item) => item.title.ar}
      columns={[
        { key: "title", header: "العنوان", render: (i) => i.title.ar },
        { key: "color", header: "اللون", render: (i) => i.color },
      ]}
      onDelete={(id) => api.deleteValue(id)}
      onReorder={(ids) => api.reorderValues(ids)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={valueSchema}
          defaultValues={defaults}
          item={
            item
              ? { title: item.title, description: item.description, icon: item.icon, color: item.color }
              : null
          }
          invalidateTags={tags.values}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updateValue(item.id, values);
            else await api.createValue(values);
          }}
        >
          {(form) => (
            <>
              <LocalizedInput label="العنوان" value={form.watch("title")} onChange={(v) => form.setValue("title", v)} />
              <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v)} multiline />
              <div className="space-y-2">
                <Label>الأيقونة</Label>
                <IconPicker value={form.watch("icon")} onChange={(v) => form.setValue("icon", v)} />
              </div>
              <div className="space-y-2">
                <Label>فئة اللون (Tailwind gradient)</Label>
                <Input {...form.register("color")} dir="ltr" className={ltrInputClass} />
              </div>
            </>
          )}
        </CollectionForm>
      )}
    />
  );
}
