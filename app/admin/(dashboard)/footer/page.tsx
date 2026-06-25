"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  api,
  useFooter,
  useFooterInfo,
  useUpdateFooterInfo,
} from "@/lib/hooks/use-cms";
import { baseApi, tags, useAppDispatch } from "@/lib/store";
import { footerInfoSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { FooterService, SocialLink } from "@/lib/types";
import type { z } from "zod";

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
  const { data: footerCollections, isLoading: isCollectionsLoading } = useFooter();
  const updateInfo = useUpdateFooterInfo();
  const dispatch = useAppDispatch();
  const [deletingService, setDeletingService] = useState<FooterService | null>(null);
  const [deletingSocial, setDeletingSocial] = useState<SocialLink | null>(null);

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

      <FormSection title="الخدمات">
        {isCollectionsLoading ? (
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        ) : (
          <>
            <ReorderableList
              items={footerCollections?.services ?? []}
              onReorder={async (reordered) => {
                await api.reorderFooterServices(reordered.map((s) => s.id));
                dispatch(baseApi.util.invalidateTags(tags.footer));
                toast.success("تم تحديث الترتيب");
              }}
              renderItem={(service) => (
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium">{service.title.ar}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setDeletingService(service)}
                  >
                    <Icon icon="solar:trash-bin-trash-bold" width={16} className="text-destructive" />
                  </Button>
                </div>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await api.createFooterService({ title: { ar: "خدمة جديدة" }, description: { ar: "وصف الخدمة" } });
                dispatch(baseApi.util.invalidateTags(tags.footer));
                toast.success("تمت الإضافة");
              }}
            >
              إضافة خدمة
            </Button>
          </>
        )}
      </FormSection>

      <FormSection title="روابط التواصل الاجتماعي">
        {isCollectionsLoading ? (
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        ) : (
          <>
            <ReorderableList
              items={footerCollections?.socials ?? []}
              onReorder={async (reordered) => {
                await api.reorderSocialLinks(reordered.map((s) => s.id));
                dispatch(baseApi.util.invalidateTags(tags.footer));
                toast.success("تم تحديث الترتيب");
              }}
              renderItem={(social) => (
                <div className="flex flex-1 items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon icon={social.icon} width={18} />
                    <span>{social.platform}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setDeletingSocial(social)}
                  >
                    <Icon icon="solar:trash-bin-trash-bold" width={16} className="text-destructive" />
                  </Button>
                </div>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await api.createSocialLink({
                  platform: "instagram",
                  url: "https://instagram.com",
                  icon: "solar:instagram-bold",
                });
                dispatch(baseApi.util.invalidateTags(tags.footer));
                toast.success("تمت الإضافة");
              }}
            >
              إضافة رابط
            </Button>
          </>
        )}
      </FormSection>

      <ConfirmDeleteDialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        onConfirm={async () => {
          if (!deletingService) return;
          await api.deleteFooterService(deletingService.id);
          dispatch(baseApi.util.invalidateTags(tags.footer));
          setDeletingService(null);
          toast.success("تم الحذف");
        }}
      />
      <ConfirmDeleteDialog
        open={!!deletingSocial}
        onOpenChange={(open) => !open && setDeletingSocial(null)}
        onConfirm={async () => {
          if (!deletingSocial) return;
          await api.deleteSocialLink(deletingSocial.id);
          dispatch(baseApi.util.invalidateTags(tags.footer));
          setDeletingSocial(null);
          toast.success("تم الحذف");
        }}
      />
    </div>
  );
}
