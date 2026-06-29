"use client";

import { toast } from "sonner";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContact, useUpdateContact } from "@/lib/hooks/use-cms";
import { contactSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { ContactUsSectionInput } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { data, isLoading } = useContact();
  const update = useUpdateContact();

  const formData: FormValues | undefined = data
    ? {
        subtitle: data.subtitle,
        title: data.title,
        description: data.description,
        phone: data.phone,
        email: data.email,
        mapLink: data.mapLink,
        primaryCtaLabel: data.primaryCtaLabel,
        primaryCtaLink: data.primaryCtaLink,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaLink: data.secondaryCtaLink,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">التواصل / CTA</h2>
      <SingletonForm
        schema={contactSchema}
        defaultValues={{
          subtitle: { ar: "" },
          title: { ar: "" },
          description: { ar: "" },
          phone: "",
          email: "",
          mapLink: null,
          primaryCtaLabel: { ar: "" },
          primaryCtaLink: "",
          secondaryCtaLabel: { ar: "" },
          secondaryCtaLink: "",
        }}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values as ContactUsSectionInput);
            toast.success("تم الحفظ");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <>
            <FormSection title="المحتوى">
              <LocalizedInput
                label="الشارة"
                value={form.watch("subtitle")}
                onChange={(v) => form.setValue("subtitle", v, { shouldDirty: true })}
              />
              <LocalizedInput
                label="العنوان"
                value={form.watch("title")}
                onChange={(v) => form.setValue("title", v, { shouldDirty: true })}
              />
              <LocalizedInput
                label="الوصف"
                value={form.watch("description")}
                onChange={(v) => form.setValue("description", v, { shouldDirty: true })}
                multiline
              />
            </FormSection>
            <FormSection title="بيانات التواصل">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>الهاتف</Label>
                  <Input {...form.register("phone")} dir="ltr" className={ltrInputClass} />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" dir="ltr" className={ltrInputClass} {...form.register("email")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>رابط الخريطة</Label>
                  <Input
                    {...form.register("mapLink")}
                    dir="ltr"
                    className={ltrInputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </FormSection>
            <FormSection title="أزرار الإجراء">
              <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedInput
                  label="الزر الأساسي — النص"
                  value={form.watch("primaryCtaLabel")}
                  onChange={(v) => form.setValue("primaryCtaLabel", v, { shouldDirty: true })}
                />
                <div className="space-y-2">
                  <Label>الزر الأساسي — الرابط</Label>
                  <Input {...form.register("primaryCtaLink")} dir="ltr" className={ltrInputClass} />
                </div>
                <LocalizedInput
                  label="الزر الثانوي — النص"
                  value={form.watch("secondaryCtaLabel")}
                  onChange={(v) => form.setValue("secondaryCtaLabel", v, { shouldDirty: true })}
                />
                <div className="space-y-2">
                  <Label>الزر الثانوي — الرابط</Label>
                  <Input
                    {...form.register("secondaryCtaLink")}
                    dir="ltr"
                    className={ltrInputClass}
                  />
                </div>
              </div>
            </FormSection>
          </>
        )}
      </SingletonForm>
    </div>
  );
}
