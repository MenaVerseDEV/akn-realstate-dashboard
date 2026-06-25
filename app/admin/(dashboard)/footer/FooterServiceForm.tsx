"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as footerServicesApi from "@/lib/api/footer-services";
import { useGetFooterServiceByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { footerServiceSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { FooterService } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof footerServiceSchema>;

const defaults: FormValues = {
  title: { ar: "" },
  link: "",
};

type FooterServiceFormProps = {
  item: FooterService | null;
  onClose: () => void;
};

export function FooterServiceForm({ item, onClose }: FooterServiceFormProps) {
  const { data: hydratedItem, isLoading } = useGetFooterServiceByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={footerServiceSchema}
      defaultValues={defaults}
      item={
        editItem ? { title: editItem.title, link: editItem.link } : null
      }
      invalidateTags={tags.footerServices}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) await footerServicesApi.update(editItem.id, values);
        else await footerServicesApi.create(values);
      }}
    >
      {(form) => (
        <>
          <LocalizedInput
            label="العنوان"
            value={form.watch("title")}
            onChange={(v) => form.setValue("title", v)}
          />
          <div className="space-y-2">
            <Label>الرابط</Label>
            <Input
              {...form.register("link")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="/services/example"
            />
          </div>
        </>
      )}
    </CollectionForm>
  );
}
