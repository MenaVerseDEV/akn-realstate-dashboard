"use client";

import { Label } from "@/components/ui/label";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { IconPicker } from "@/components/cms/IconPicker";
import { api, queryKeys, useFeatures } from "@/lib/hooks/use-cms";
import { featureSchema } from "@/lib/schemas";
import type { Feature } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof featureSchema>;

const defaults: FormValues = {
  title: { ar: "" },
  description: { ar: "" },
  icon: "solar:star-bold",
};

export default function FeaturesPage() {
  const { data: items = [], isLoading } = useFeatures();

  return (
    <CollectionEditor<Feature>
      title="المميزات"
      items={items}
      isLoading={isLoading}
      queryKey={queryKeys.features}
      addLabel="إضافة ميزة"
      reorderable
      getLabel={(item) => item.title.ar}
      columns={[{ key: "title", header: "العنوان", render: (i) => i.title.ar }]}
      onDelete={(id) => api.deleteFeature(id)}
      onReorder={(ids) => api.reorderFeatures(ids)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={featureSchema}
          defaultValues={defaults}
          item={
            item
              ? { title: item.title, description: item.description, icon: item.icon }
              : null
          }
          queryKey={queryKeys.features}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updateFeature(item.id, values);
            else await api.createFeature(values);
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
            </>
          )}
        </CollectionForm>
      )}
    />
  );
}
