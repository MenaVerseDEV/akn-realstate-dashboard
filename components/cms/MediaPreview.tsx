"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaPreviewProps = {
  value: string | null;
  isUploading?: boolean;
  uploadPreviewUrl?: string | null;
  uploadFileName?: string | null;
  isVideo?: boolean;
  label?: string;
  onOpen: () => void;
  onRemove: () => void;
  className?: string;
};

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export function MediaPreview({
  value,
  isUploading = false,
  uploadPreviewUrl,
  uploadFileName,
  isVideo,
  label = "وسائط",
  onOpen,
  onRemove,
  className,
}: MediaPreviewProps) {
  const showVideo = isVideo ?? (value ? isVideoUrl(value) : false);
  const previewSrc = value;
  const hasMedia = Boolean(previewSrc);

  if (isUploading) {
    return (
      <div
        className={cn(
          "relative h-40 w-full overflow-hidden border-2 border-primary bg-bg-dark",
          className,
        )}
      >
        {uploadPreviewUrl && !showVideo ? (
          <Image src={uploadPreviewUrl} alt="" fill className="object-cover opacity-60" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center bg-bg-dark">
            <Icon icon="solar:video-frame-bold" width={40} className="text-primary/50" />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark/40 backdrop-blur-[1px]">
          <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-bg-card">
            <Icon icon="solar:refresh-bold" width={20} className="animate-spin text-primary" />
          </div>
          <div className="space-y-1 px-4 text-center">
            <p className="text-sm font-medium text-white">جاري الرفع...</p>
            {uploadFileName ? (
              <p className="max-w-[220px] truncate text-xs text-white/80">{uploadFileName}</p>
            ) : null}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-primary/20">
          <div className="h-full w-1/3 animate-[media-upload_1.2s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>
    );
  }

  if (!hasMedia) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "group flex h-40 w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-bg transition-colors hover:border-primary/50 hover:bg-bg-dark",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-bg-card transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
          <Icon
            icon="solar:gallery-add-bold"
            width={24}
            className="text-muted-foreground transition-colors group-hover:text-primary"
          />
        </div>
        <div className="space-y-1 px-4 text-center">
          <p className="text-sm font-medium text-dark">لا توجد {label}</p>
          <p className="text-xs text-muted-foreground">انقر لاختيار أو رفع ملف</p>
        </div>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group relative h-40 w-full overflow-hidden border border-border bg-bg-dark",
        className,
      )}
    >
      {showVideo ? (
        <video src={previewSrc!} className="h-full w-full object-cover" muted playsInline />
      ) : (
        <Image src={previewSrc!} alt="" fill className="object-cover" unoptimized />
      )}

      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-dark/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-none bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {showVideo ? "فيديو" : "صورة"}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-dark/0 opacity-0 transition-all group-hover:bg-dark/45 group-hover:opacity-100">
        <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={onOpen}>
          <Icon icon="solar:pen-bold" width={14} />
          تغيير
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 border-white/30 bg-bg-card/90 text-dark hover:bg-bg-card"
          onClick={onRemove}
        >
          <Icon icon="solar:trash-bin-minimalistic-bold" width={14} />
          إزالة
        </Button>
      </div>
    </div>
  );
}
