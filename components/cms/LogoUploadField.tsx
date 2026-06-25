"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import { cn } from "@/lib/utils";

type LogoUploadFieldProps = {
  label?: string;
  logoUrl: string | null;
  logoFile: File | null;
  onLogoUrlChange: (url: string | null) => void;
  onLogoFileChange: (file: File | null) => void;
};

export function LogoUploadField({
  label = "الشعار",
  logoUrl,
  logoFile,
  onLogoUrlChange,
  onLogoFileChange,
}: LogoUploadFieldProps) {
  const previewUrlRef = useRef<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      previewUrlRef.current = objectUrl;
      setLocalPreviewUrl(objectUrl);
      return;
    }

    setLocalPreviewUrl(null);
  }, [logoFile]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  const previewSrc = localPreviewUrl ?? logoUrl;
  const hasPreview = Boolean(previewSrc);
  const isNewFile = Boolean(logoFile);

  const handleFileSelect = (file: File) => {
    onLogoFileChange(file);
  };

  const handleRemoveNewFile = () => {
    onLogoFileChange(null);
  };

  const handleRemoveAll = () => {
    onLogoFileChange(null);
    onLogoUrlChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {hasPreview ? (
        <div
          className={cn(
            "group relative h-40 w-full overflow-hidden border border-border bg-bg-dark",
          )}
        >
          <Image src={previewSrc!} alt="" fill className="object-contain p-4" unoptimized />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-dark/0 opacity-0 transition-all group-hover:bg-dark/45 group-hover:opacity-100">
            <Button type="button" size="sm" variant="secondary" asChild>
              <label className="cursor-pointer gap-1.5">
                <Icon icon="solar:pen-bold" width={14} />
                تغيير
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFileSelect(file);
                    event.target.value = "";
                  }}
                />
              </label>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={isNewFile ? handleRemoveNewFile : handleRemoveAll}
            >
              <Icon icon="solar:trash-bin-minimalistic-bold" width={14} />
              {isNewFile ? "إلغاء" : "إزالة"}
            </Button>
          </div>
        </div>
      ) : (
        <MediaDropzone
          accept="image/*"
          onFileSelect={handleFileSelect}
          onInvalidFile={() => undefined}
        />
      )}
    </div>
  );
}
