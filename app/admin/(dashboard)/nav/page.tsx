"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { api, queryKeys, useNav } from "@/lib/hooks/use-cms";
import { navLinkSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { NavLink } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof navLinkSchema>;

const defaults: FormValues = {
  label: { ar: "" },
  href: "",
  visible: true,
};

export default function NavPage() {
  const { data: items = [], isLoading } = useNav();

  return (
    <CollectionEditor<NavLink>
      title="التنقل"
      items={items}
      isLoading={isLoading}
      queryKey={queryKeys.nav}
      addLabel="إضافة رابط"
      reorderable
      getLabel={(item) => item.label.ar}
      columns={[
        { key: "label", header: "العنوان", render: (i) => i.label.ar },
        { key: "href", header: "الرابط", render: (i) => i.href },
        { key: "visible", header: "ظاهر", render: (i) => (i.visible ? "نعم" : "لا") },
      ]}
      onDelete={(id) => api.deleteNav(id)}
      onReorder={(ids) => api.reorderNav(ids)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={navLinkSchema}
          defaultValues={defaults}
          item={item ? { label: item.label, href: item.href, visible: item.visible } : null}
          queryKey={queryKeys.nav}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updateNav(item.id, values);
            else await api.createNav(values);
          }}
        >
          {(form) => (
            <>
              <LocalizedInput
                label="العنوان"
                value={form.watch("label")}
                onChange={(v) => form.setValue("label", v)}
              />
              <div className="space-y-2">
                <Label>الرابط</Label>
                <Input {...form.register("href")} dir="ltr" className={ltrInputClass} placeholder="#hero" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("visible")}
                  onCheckedChange={(v) => form.setValue("visible", v)}
                />
                <Label>ظاهر في القائمة</Label>
              </div>
            </>
          )}
        </CollectionForm>
      )}
    />
  );
}
