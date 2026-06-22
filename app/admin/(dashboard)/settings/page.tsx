"use client";

import { toast } from "sonner";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings, useUpdateSettings } from "@/lib/hooks/use-cms";
import { siteSettingsSchema } from "@/lib/schemas";
import type { z } from "zod";

type FormValues = z.infer<typeof siteSettingsSchema>;

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();

  const formData: FormValues | undefined = data
    ? {
        siteName: data.siteName,
        logoUrl: data.logoUrl,
        defaultLocale: data.defaultLocale,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">إعدادات الموقع</h2>
      <SingletonForm
        schema={siteSettingsSchema}
        defaultValues={{
          siteName: { ar: "" },
          logoUrl: null,
          defaultLocale: "ar",
        }}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values);
            toast.success("تم حفظ الإعدادات");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <FormSection title="المعلومات الأساسية">
            <LocalizedInput
              label="اسم الموقع"
              value={form.watch("siteName")}
              onChange={(v) => form.setValue("siteName", v, { shouldDirty: true })}
            />
            <div className="space-y-2">
              <Label>اللغة الافتراضية</Label>
              <Select
                value={form.watch("defaultLocale")}
                onValueChange={(v) =>
                  form.setValue("defaultLocale", v as "ar" | "en", { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <MediaPicker
              label="الشعار"
              value={form.watch("logoUrl")}
              onChange={(v) => form.setValue("logoUrl", v, { shouldDirty: true })}
            />
          </FormSection>
        )}
      </SingletonForm>
    </div>
  );
}
