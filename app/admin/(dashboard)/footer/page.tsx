"use client";

import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { toDisplayIcon } from "@/lib/icons";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFooterInfo,
  useFooterServices,
  useFooterSocialLinks,
  useUpdateFooterInfo,
} from "@/lib/hooks/use-cms";
import * as footerServicesApi from "@/lib/api/footer-services";
import * as footerSocialLinksApi from "@/lib/api/footer-social-links";
import { tags } from "@/lib/store";
import { footerInfoSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { z } from "zod";
import { FooterServiceForm } from "./FooterServiceForm";
import { FooterSocialLinkForm } from "./FooterSocialLinkForm";

type FormValues = z.infer<typeof footerInfoSchema>;

const defaultValues: FormValues = {
  companyName: { ar: "" },
  description: { ar: "" },
  logoUrl: null,
  logoFile: null,
  address: { ar: "" },
  phone: "",
  email: "",
};

export default function FooterPage() {
  const { data: footerInfo, isLoading: isInfoLoading } = useFooterInfo();
  const { data: services = [], isLoading: isServicesLoading } = useFooterServices();
  const { data: socialLinks = [], isLoading: isSocialsLoading } = useFooterSocialLinks();
  const updateInfo = useUpdateFooterInfo();

  const formData: FormValues | undefined = footerInfo
    ? {
        companyName: footerInfo.companyName,
        description: footerInfo.description,
        logoUrl: footerInfo.logoUrl,
        logoFile: null,
        address: footerInfo.address,
        phone: footerInfo.phone,
        email: footerInfo.email,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">التذييل</h2>
      <SingletonForm
        schema={footerInfoSchema}
        defaultValues={defaultValues}
        data={formData}
        isLoading={isInfoLoading}
        saving={updateInfo.isPending}
        onSubmit={async (values) => {
          try {
            await updateInfo.mutateAsync(values);
            toast.success("تم الحفظ");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <FormSection title="معلومات الشركة">
            <LocalizedInput
              label="اسم الشركة"
              value={form.watch("companyName")}
              onChange={(v) => form.setValue("companyName", v, { shouldDirty: true })}
            />
            <LocalizedInput
              label="الوصف"
              value={form.watch("description")}
              onChange={(v) => form.setValue("description", v, { shouldDirty: true })}
              multiline
            />
            <LocalizedInput
              label="العنوان"
              value={form.watch("address")}
              onChange={(v) => form.setValue("address", v, { shouldDirty: true })}
            />
            <LogoUploadField
              logoUrl={form.watch("logoUrl")}
              logoFile={form.watch("logoFile") ?? null}
              onLogoUrlChange={(url) => form.setValue("logoUrl", url, { shouldDirty: true })}
              onLogoFileChange={(file) => form.setValue("logoFile", file, { shouldDirty: true })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>الهاتف</Label>
                <Input {...form.register("phone")} dir="ltr" className={ltrInputClass} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" dir="ltr" className={ltrInputClass} {...form.register("email")} />
              </div>
            </div>
          </FormSection>
        )}
      </SingletonForm>

      <CollectionEditor
        title="الخدمات"
        items={services}
        isLoading={isServicesLoading}
        invalidateTags={tags.footerServices}
        addLabel="إضافة خدمة"
        reorderable
        getLabel={(item) => item.title.ar}
        columns={[
          { key: "title", header: "العنوان", render: (i) => i.title.ar },
          { key: "link", header: "الرابط", render: (i) => i.link },
        ]}
        onDelete={(id) => footerServicesApi.deleteService(id)}
        onReorder={(ids) => footerServicesApi.reorder(ids)}
        renderForm={(item, onClose) => <FooterServiceForm item={item} onClose={onClose} />}
      />

      <CollectionEditor
        title="روابط التواصل الاجتماعي"
        items={socialLinks}
        isLoading={isSocialsLoading}
        invalidateTags={tags.footerSocialLinks}
        addLabel="إضافة رابط"
        reorderable
        getLabel={(item) => item.platform}
        columns={[
          {
            key: "icon",
            header: "الأيقونة",
            render: (i) => <Icon icon={toDisplayIcon(i.icon)} width={18} />,
          },
          { key: "platform", header: "المنصة", render: (i) => i.platform },
          { key: "url", header: "الرابط", render: (i) => i.url },
        ]}
        onDelete={(id) => footerSocialLinksApi.deleteLink(id)}
        onReorder={(ids) => footerSocialLinksApi.reorder(ids)}
        renderForm={(item, onClose) => <FooterSocialLinkForm item={item} onClose={onClose} />}
      />
    </div>
  );
}
