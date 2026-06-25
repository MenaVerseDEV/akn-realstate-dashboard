"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import { IconPicker, SOCIAL_ICONS } from "@/components/cms/IconPicker";
import * as footerSocialLinksApi from "@/lib/api/footer-social-links";
import { useGetFooterSocialLinkByIdQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { socialLinkSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import { toDisplayIcon } from "@/lib/icons";
import type { SocialLink } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof socialLinkSchema>;

const defaults: FormValues = {
  platform: "",
  url: "",
  icon: SOCIAL_ICONS[0],
};

type FooterSocialLinkFormProps = {
  item: SocialLink | null;
  onClose: () => void;
};

export function FooterSocialLinkForm({ item, onClose }: FooterSocialLinkFormProps) {
  const { data: hydratedItem, isLoading } = useGetFooterSocialLinkByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={socialLinkSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              platform: editItem.platform,
              url: editItem.url,
              icon: toDisplayIcon(editItem.icon),
            }
          : null
      }
      invalidateTags={tags.footerSocialLinks}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) await footerSocialLinksApi.update(editItem.id, values);
        else await footerSocialLinksApi.create(values);
      }}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>المنصة</Label>
            <Input {...form.register("platform")} placeholder="Facebook" />
          </div>
          <div className="space-y-2">
            <Label>الرابط</Label>
            <Input
              {...form.register("url")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="https://facebook.com/example"
            />
          </div>
          <div className="space-y-2">
            <Label>الأيقونة</Label>
            <IconPicker
              value={form.watch("icon")}
              onChange={(icon) => form.setValue("icon", icon, { shouldDirty: true })}
              icons={SOCIAL_ICONS}
            />
          </div>
        </>
      )}
    </CollectionForm>
  );
}
