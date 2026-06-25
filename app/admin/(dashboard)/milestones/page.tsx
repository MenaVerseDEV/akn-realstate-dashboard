"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { IconPicker } from "@/components/cms/IconPicker";
import { api, useMilestones } from "@/lib/hooks/use-cms";
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

export default function MilestonesPage() {
  const { data: items = [], isLoading } = useMilestones();

  return (
    <CollectionEditor<Milestone>
      title="التطلعات"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.milestones}
      addLabel="إضافة تطلع"
      reorderable
      getLabel={(item) => `${item.year} — ${item.title.ar}`}
      columns={[
        { key: "year", header: "السنة", render: (i) => i.year },
        { key: "title", header: "العنوان", render: (i) => i.title.ar },
      ]}
      onDelete={(id) => api.deleteMilestone(id)}
      onReorder={(ids) => api.reorderMilestones(ids)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={milestoneSchema}
          defaultValues={defaults}
          item={
            item
              ? { year: item.year, title: item.title, description: item.description, icon: item.icon }
              : null
          }
          invalidateTags={tags.milestones}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updateMilestone(item.id, values);
            else await api.createMilestone(values);
          }}
        >
          {(form) => (
            <>
              <div className="space-y-2">
                <Label>السنة</Label>
                <Input {...form.register("year")} dir="ltr" className={ltrInputClass} placeholder="2030" />
              </div>
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
