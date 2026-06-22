"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, queryKeys, useFooter, useUpdateFooter } from "@/lib/hooks/use-cms";
import { footerSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { FooterService, SocialLink } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof footerSchema>;

export default function FooterPage() {
  const { data, isLoading } = useFooter();
  const update = useUpdateFooter();
  const qc = useQueryClient();
  const [deletingService, setDeletingService] = useState<FooterService | null>(null);
  const [deletingSocial, setDeletingSocial] = useState<SocialLink | null>(null);

  const formData: FormValues | undefined = data
    ? {
        companyName: data.companyName,
        description: data.description,
        logoUrl: data.logoUrl,
        address: data.address,
        phone: data.phone,
        email: data.email,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">التذييل</h2>
      <SingletonForm
        schema={footerSchema}
        defaultValues={{
          companyName: { ar: "" },
          description: { ar: "" },
          logoUrl: null,
          address: { ar: "" },
          phone: "",
          email: "",
        }}
        data={formData}
        isLoading={isLoading}
        saving={update.isPending}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync(values);
            toast.success("تم الحفظ");
          } catch {
            toast.error("فشل الحفظ");
          }
        }}
      >
        {(form) => (
          <FormSection title="معلومات الشركة">
            <LocalizedInput label="اسم الشركة" value={form.watch("companyName")} onChange={(v) => form.setValue("companyName", v, { shouldDirty: true })} />
            <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v, { shouldDirty: true })} multiline />
            <LocalizedInput label="العنوان" value={form.watch("address")} onChange={(v) => form.setValue("address", v, { shouldDirty: true })} />
            <MediaPicker label="الشعار" value={form.watch("logoUrl")} onChange={(v) => form.setValue("logoUrl", v, { shouldDirty: true })} />
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
        <ReorderableList
          items={data?.services ?? []}
          onReorder={async (reordered) => {
            await api.reorderFooterServices(reordered.map((s) => s.id));
            await qc.invalidateQueries({ queryKey: queryKeys.footer });
            toast.success("تم تحديث الترتيب");
          }}
          renderItem={(service) => (
            <div className="flex flex-1 items-center justify-between">
              <span className="font-medium">{service.title.ar}</span>
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setDeletingService(service)}>
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
            await qc.invalidateQueries({ queryKey: queryKeys.footer });
            toast.success("تمت الإضافة");
          }}
        >
          إضافة خدمة
        </Button>
      </FormSection>

      <FormSection title="روابط التواصل الاجتماعي">
        <ReorderableList
          items={data?.socials ?? []}
          onReorder={async (reordered) => {
            await api.reorderSocialLinks(reordered.map((s) => s.id));
            await qc.invalidateQueries({ queryKey: queryKeys.footer });
            toast.success("تم تحديث الترتيب");
          }}
          renderItem={(social) => (
            <div className="flex flex-1 items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon icon={social.icon} width={18} />
                <span>{social.platform}</span>
              </div>
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setDeletingSocial(social)}>
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
            await qc.invalidateQueries({ queryKey: queryKeys.footer });
            toast.success("تمت الإضافة");
          }}
        >
          إضافة رابط
        </Button>
      </FormSection>

      <ConfirmDeleteDialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        onConfirm={async () => {
          if (!deletingService) return;
          await api.deleteFooterService(deletingService.id);
          await qc.invalidateQueries({ queryKey: queryKeys.footer });
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
          await qc.invalidateQueries({ queryKey: queryKeys.footer });
          setDeletingSocial(null);
          toast.success("تم الحذف");
        }}
      />
    </div>
  );
}
