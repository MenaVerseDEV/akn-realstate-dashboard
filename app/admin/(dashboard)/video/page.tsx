"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FormSection } from "@/components/cms/FormSection";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { LogoUploadField } from "@/components/cms/LogoUploadField";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import { SingletonForm } from "@/components/cms/SingletonForm";
import { Label } from "@/components/ui/label";
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
        videoFile: null,
        coverImageUrl: data.coverImageUrl,
        coverImageFile: null,
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
          videoFile: null,
          coverImageUrl: null,
          coverImageFile: null,
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
            <VideoUploadField
              videoUrl={form.watch("videoUrl")}
              videoFile={form.watch("videoFile") ?? null}
              onVideoUrlChange={(v) => form.setValue("videoUrl", v, { shouldDirty: true })}
              onVideoFileChange={(v) => form.setValue("videoFile", v, { shouldDirty: true })}
            />
            <LogoUploadField
              label="صورة الغلاف"
              logoUrl={form.watch("coverImageUrl")}
              logoFile={form.watch("coverImageFile") ?? null}
              onLogoUrlChange={(v) => form.setValue("coverImageUrl", v, { shouldDirty: true })}
              onLogoFileChange={(v) => form.setValue("coverImageFile", v, { shouldDirty: true })}
            />
          </FormSection>
        )}
      </SingletonForm>
    </div>
  );
}

type VideoUploadFieldProps = {
  videoUrl: string | null;
  videoFile: File | null;
  onVideoUrlChange: (url: string | null) => void;
  onVideoFileChange: (file: File | null) => void;
};

function VideoUploadField({
  videoUrl,
  videoFile,
  onVideoUrlChange,
  onVideoFileChange,
}: VideoUploadFieldProps) {
  const previewUrlRef = useRef<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      previewUrlRef.current = objectUrl;
      setLocalPreviewUrl(objectUrl);
      return;
    }

    setLocalPreviewUrl(null);
  }, [videoFile]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  const previewSrc = localPreviewUrl ?? videoUrl;
  const hasPreview = Boolean(previewSrc);
  const isNewFile = Boolean(videoFile);

  return (
    <div className="space-y-2">
      <Label>ملف الفيديو</Label>

      {hasPreview ? (
        <div className="space-y-2 border border-border bg-bg-dark p-4">
          <video src={previewSrc!} controls className="max-h-48 w-full" />
          <div className="flex gap-2">
            <label className="cursor-pointer text-sm text-primary underline">
              تغيير
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onVideoFileChange(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              className="text-sm text-muted-foreground underline"
              onClick={() => {
                if (isNewFile) {
                  onVideoFileChange(null);
                } else {
                  onVideoFileChange(null);
                  onVideoUrlChange(null);
                }
              }}
            >
              {isNewFile ? "إلغاء" : "إزالة"}
            </button>
          </div>
        </div>
      ) : (
        <MediaDropzone
          accept="video/*"
          onFileSelect={(file) => onVideoFileChange(file)}
          onInvalidFile={() => undefined}
        />
      )}
    </div>
  );
}
