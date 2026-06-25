"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type MediaDropzoneProps = {
  onFileSelect: (file: File) => void | Promise<void>;
  onInvalidFile?: () => void;
  accept?: string;
  isUploading?: boolean;
  uploadPreviewUrl?: string | null;
  uploadFileName?: string | null;
  uploadIsVideo?: boolean;
  disabled?: boolean;
  className?: string;
};

function matchesAccept(file: File, accept: string): boolean {
  const types = accept.split(",").map((type) => type.trim());

  return types.some((type) => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
}

export function MediaDropzone({
  onFileSelect,
  onInvalidFile,
  accept = "image/*,video/*",
  isUploading = false,
  uploadPreviewUrl,
  uploadFileName,
  uploadIsVideo = false,
  disabled = false,
  className,
}: MediaDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!matchesAccept(file, accept)) {
        onInvalidFile?.();
        return;
      }
      await onFileSelect(file);
    },
    [accept, onFileSelect, onInvalidFile],
  );

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || isUploading) return;

    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current = 0;
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    event.target.value = "";
  };

  const openFilePicker = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  if (isUploading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-none border-2 border-primary bg-bg-dark",
          className,
        )}
      >
        <div className="relative h-36 w-full">
          {uploadPreviewUrl && !uploadIsVideo ? (
            <Image
              src={uploadPreviewUrl}
              alt=""
              fill
              className="object-cover opacity-50"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-bg-dark">
              <Icon icon="solar:video-frame-bold" width={36} className="text-primary/40" />
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-dark/35">
            <Icon icon="solar:refresh-bold" width={28} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-dark">جاري رفع الملف...</p>
            {uploadFileName ? (
              <p className="max-w-xs truncate px-4 text-xs text-muted-foreground">
                {uploadFileName}
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-border bg-bg-card px-4 py-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
            <div className="h-full w-1/3 animate-[media-upload_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFilePicker();
        }
      }}
      onClick={openFilePicker}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed p-6 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border bg-bg hover:border-primary/40 hover:bg-bg-dark",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full border border-border bg-bg-card",
          isDragging && "border-primary bg-primary/10",
        )}
      >
        <Icon
          icon={isDragging ? "solar:download-bold" : "solar:cloud-upload-bold"}
          width={24}
          className="text-primary"
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-dark">
          {isDragging ? "أفلت الملف هنا" : "اسحب الملف وأفلته هنا"}
        </p>
        <p className="text-xs text-muted-foreground">أو انقر لاختيار صورة أو فيديو</p>
        <p className="text-xs text-muted-foreground/80">PNG, JPG, WEBP, MP4 — حتى {formatFileSize(10 * 1024 * 1024)}</p>
      </div>
    </div>
  );
}
