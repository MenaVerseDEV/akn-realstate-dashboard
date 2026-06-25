"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import { MediaPreview } from "@/components/cms/MediaPreview";
import { useMedia, api } from "@/lib/hooks/use-cms";
import { toast } from "sonner";
import { GridLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import { cn } from "@/lib/utils";

type MediaPickerProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
};

function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

export function MediaPicker({
  value,
  onChange,
  label = "وسائط",
  accept = "image/*,video/*",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadIsVideo, setUploadIsVideo] = useState(false);
  const previewUrlRef = useRef<string | null>(null);
  const qc = useQueryClient();
  const { data, isLoading } = useMedia(1, "image");

  const clearUploadPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploadPreviewUrl(null);
    setUploadFileName(null);
    setUploadIsVideo(false);
  }, []);

  useEffect(() => () => clearUploadPreview(), [clearUploadPreview]);

  const handleUpload = useCallback(
    async (file: File) => {
      clearUploadPreview();
      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;
      setUploadPreviewUrl(objectUrl);
      setUploadFileName(file.name);
      setUploadIsVideo(isVideoFile(file));
      setIsUploading(true);

      try {
        const asset = await api.uploadMedia(file);
        await qc.invalidateQueries({ queryKey: ["media"] });
        onChange(asset.url);
        toast.success("تم رفع الملف");
        setOpen(false);
      } catch {
        toast.error("فشل رفع الملف");
      } finally {
        setIsUploading(false);
        clearUploadPreview();
      }
    },
    [clearUploadPreview, onChange, qc],
  );

  const handleRemove = () => {
    onChange(null);
    toast.success("تمت إزالة الوسائط");
  };

  const isVideoOnly = accept === "video/*";

  return (
    <div className="space-y-3">
      <MediaPreview
        value={value}
        isUploading={isUploading}
        uploadPreviewUrl={uploadPreviewUrl}
        uploadFileName={uploadFileName}
        isVideo={
          isUploading
            ? uploadIsVideo
            : isVideoOnly || (value ? /\.(mp4|webm|ogg|mov)(\?|$)/i.test(value) : false)
        }
        label={label}
        onOpen={() => setOpen(true)}
        onRemove={handleRemove}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full gap-2">
            <Icon icon="solar:gallery-bold" width={18} />
            {value ? `تغيير ${label}` : `اختيار ${label}`}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle>مكتبة الوسائط</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <MediaDropzone
              accept={accept}
              isUploading={isUploading}
              uploadPreviewUrl={uploadPreviewUrl}
              uploadFileName={uploadFileName}
              uploadIsVideo={uploadIsVideo}
              onFileSelect={handleUpload}
              onInvalidFile={() => toast.error("نوع الملف غير مدعوم")}
            />

            {value && !isUploading ? (
              <div className="flex items-center gap-3 rounded-none border border-border bg-bg p-3">
                <div className="relative size-14 shrink-0 overflow-hidden border border-border">
                  {/\.(mp4|webm|ogg|mov)(\?|$)/i.test(value) ? (
                    <div className="flex h-full items-center justify-center bg-bg-dark">
                      <Icon icon="solar:video-frame-bold" width={20} className="text-primary" />
                    </div>
                  ) : (
                    <Image src={value} alt="" fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark">الاختيار الحالي</p>
                  <p className="truncate text-xs text-muted-foreground">{value}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                  إزالة
                </Button>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium text-dark">أو اختر من المكتبة</p>
              {isLoading ? (
                <GridLoadingSkeleton count={4} />
              ) : data?.data.length === 0 ? (
                <div className="flex h-24 flex-col items-center justify-center gap-2 border border-dashed border-border text-sm text-muted-foreground">
                  <Icon icon="solar:gallery-minimalistic-bold" width={24} className="opacity-50" />
                  لا توجد وسائط بعد
                </div>
              ) : (
                <div className="grid max-h-80 grid-cols-4 gap-2 overflow-y-auto">
                  {data?.data.map((asset) => {
                    const selected = value === asset.url;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          onChange(asset.url);
                          setOpen(false);
                          toast.success("تم اختيار الوسائط");
                        }}
                        className={cn(
                          "relative aspect-square overflow-hidden border transition-colors",
                          selected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-primary",
                        )}
                      >
                        <Image src={asset.url} alt="" fill className="object-cover" unoptimized />
                        {selected ? (
                          <span className="absolute inset-x-0 bottom-0 bg-primary py-0.5 text-center text-[10px] font-medium text-primary-foreground">
                            محدد
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
