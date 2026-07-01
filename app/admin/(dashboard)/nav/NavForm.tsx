"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import {
  useCreateNavMutation,
  useGetNavByIdQuery,
  useUpdateNavMutation,
} from "@/lib/store/api";
import { tags } from "@/lib/store";
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

type NavFormProps = {
  item: NavLink | null;
  onClose: () => void;
};

export function NavForm({ item, onClose }: NavFormProps) {
  const { data: hydratedItem, isLoading } = useGetNavByIdQuery(item?.id ?? "", {
    skip: !item?.id,
  });
  const [createNav] = useCreateNavMutation();
  const [updateNav] = useUpdateNavMutation();

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={navLinkSchema}
      defaultValues={defaults}
      item={
        editItem
          ? { label: editItem.label, href: editItem.href, visible: editItem.visible }
          : null
      }
      invalidateTags={tags.nav}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) await updateNav({ id: editItem.id, body: values }).unwrap();
        else await createNav(values).unwrap();
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
            <Input
              {...form.register("href")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="/"
            />
          </div>
          <div className="flex items-center justify-between rounded-none border border-border bg-bg p-4">
            <Label htmlFor="nav-visible" className="font-medium">
              ظاهر في القائمة
            </Label>
            <Switch
              id="nav-visible"
              checked={form.watch("visible")}
              onCheckedChange={(v) => form.setValue("visible", v)}
            />
          </div>
        </>
      )}
    </CollectionForm>
  );
}
