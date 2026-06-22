"use client";

import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { api, queryKeys, usePartners } from "@/lib/hooks/use-cms";
import { partnerSchema } from "@/lib/schemas";
import type { Partner } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof partnerSchema>;

const defaults: FormValues = {
  name: { ar: "" },
  logoUrl: null,
};

export default function PartnersPage() {
  const { data: items = [], isLoading } = usePartners();

  return (
    <CollectionEditor<Partner>
      title="الشركاء"
      items={items}
      isLoading={isLoading}
      queryKey={queryKeys.partners}
      addLabel="إضافة شريك"
      reorderable
      getLabel={(item) => item.name.ar}
      columns={[{ key: "name", header: "الاسم", render: (i) => i.name.ar }]}
      onDelete={(id) => api.deletePartner(id)}
      onReorder={(ids) => api.reorderPartners(ids)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={partnerSchema}
          defaultValues={defaults}
          item={item ? { name: item.name, logoUrl: item.logoUrl } : null}
          queryKey={queryKeys.partners}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updatePartner(item.id, values);
            else await api.createPartner(values);
          }}
        >
          {(form) => (
            <>
              <LocalizedInput label="الاسم" value={form.watch("name")} onChange={(v) => form.setValue("name", v)} />
              <MediaPicker label="الشعار" value={form.watch("logoUrl")} onChange={(v) => form.setValue("logoUrl", v)} />
            </>
          )}
        </CollectionForm>
      )}
    />
  );
}
