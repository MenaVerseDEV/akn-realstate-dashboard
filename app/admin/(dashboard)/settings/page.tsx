"use client";

import { toast } from "sonner";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { MapLinkField } from "@/components/cms/MapLinkField";
import { SingletonForm } from "@/components/cms/SingletonForm";
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
import { DEFAULT_LANGUAGES, type DefaultLanguage } from "@/lib/types";

import type { z } from "zod";

type FormValues = z.infer<typeof siteSettingsSchema>;

const languageLabels: Record<DefaultLanguage, string> = {
  en: "English",
  ar: "العربية",
};

const defaultValues: FormValues = {
  siteName: { ar: "" },
  logoUrl: null,
  mapLink: null,
  logoFile: null,
  defaultLocale: "ar",
};

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();

  const formData: FormValues | undefined = data
    ? {
        siteName: data.siteName,
        logoUrl: data.logoUrl,
        mapLink: data.mapLink,
        defaultLocale: data.defaultLocale,
        logoFile: null,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">إعدادات الموقع</h2>
      <SingletonForm
        schema={siteSettingsSchema}
        defaultValues={defaultValues}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values);
            toast.success("تم حفظ الإعدادات");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <>
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
                  form.setValue("defaultLocale", v as DefaultLanguage, { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {languageLabels[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <LogoUploadField
              logoUrl={form.watch("logoUrl")}
              logoFile={form.watch("logoFile") ?? null}
              onLogoUrlChange={(url) => form.setValue("logoUrl", url, { shouldDirty: true })}
              onLogoFileChange={(file) => form.setValue("logoFile", file, { shouldDirty: true })}
            />
          </FormSection>
          <FormSection title="الموقع على الخريطة">
            <MapLinkField
              value={form.watch("mapLink")}
              onChange={(mapLink) => form.setValue("mapLink", mapLink, { shouldDirty: true })}
            />
          </FormSection>
          </>
        )}
      </SingletonForm>
    </div>
  );
}
