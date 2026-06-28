"use client";

import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as partnersApi from "@/lib/api/partners";
import { useGetPartnerByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { partnerSchema } from "@/lib/schemas";
import type { Partner } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof partnerSchema>;

const defaults: FormValues = {
  name: { ar: "" },
  logoUrl: null,
  logoFile: null,
};

type PartnerFormProps = {
  item: Partner | null;
  onClose: () => void;
  itemCount?: number;
};

export function PartnerForm({ item, onClose, itemCount = 0 }: PartnerFormProps) {
  const { data: hydratedItem, isLoading } = useGetPartnerByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={partnerSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              name: editItem.name,
              logoUrl: editItem.logoUrl,
              logoFile: null,
            }
          : null
      }
      invalidateTags={tags.partners}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) {
          await partnersApi.update(editItem.id, values);
        } else {
          await partnersApi.create(values, itemCount + 1);
        }
      }}
    >
      {(form) => (
        <>
          <LocalizedInput
            label="الاسم"
            value={form.watch("name")}
            onChange={(v) => form.setValue("name", v)}
          />
          <LogoUploadField
            logoUrl={form.watch("logoUrl")}
            logoFile={form.watch("logoFile") ?? null}
            onLogoUrlChange={(v) => form.setValue("logoUrl", v)}
            onLogoFileChange={(v) => form.setValue("logoFile", v, { shouldDirty: true })}
          />
        </>
      )}
    </CollectionForm>
  );
}
