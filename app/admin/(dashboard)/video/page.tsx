"use client";

import { toast } from "sonner";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { useUpdateVideo, useVideo } from "@/lib/hooks/use-cms";
import { videoSchema } from "@/lib/schemas";
import type { z } from "zod";

type FormValues = z.infer<typeof videoSchema>;

export default function VideoPage() {
  const { data, isLoading } = useVideo();
  const update = useUpdateVideo();

  const formData: FormValues | undefined = data
    ? {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        posterUrl: data.posterUrl,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">عرض الفيديو</h2>
      <SingletonForm
        schema={videoSchema}
        defaultValues={{
          title: { ar: "" },
          description: { ar: "" },
          videoUrl: null,
          posterUrl: null,
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
          <FormSection title="الفيديو">
            <LocalizedInput label="العنوان" value={form.watch("title")} onChange={(v) => form.setValue("title", v, { shouldDirty: true })} />
            <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v, { shouldDirty: true })} multiline />
            <MediaPicker label="ملف الفيديو" value={form.watch("videoUrl")} onChange={(v) => form.setValue("videoUrl", v, { shouldDirty: true })} />
            <MediaPicker label="صورة الغلاف" value={form.watch("posterUrl")} onChange={(v) => form.setValue("posterUrl", v, { shouldDirty: true })} />
          </FormSection>
        )}
      </SingletonForm>
    </div>
  );
}
