"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMedia } from "@/lib/hooks/use-cms";
import { api } from "@/lib/hooks/use-cms";
import { toast } from "sonner";
import { GridLoadingSkeleton } from "@/components/cms/LoadingSkeleton";

type MediaPickerProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
};

export function MediaPicker({ value, onChange, label = "اختر وسائط" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useMedia(1, "image");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const asset = await api.uploadMedia(file);
      onChange(asset.url);
      toast.success("تم رفع الملف");
      setOpen(false);
    } catch {
      toast.error("فشل رفع الملف");
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative h-32 w-full overflow-hidden border border-border">
          <Image src={value} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="gap-2">
            <Icon icon="solar:gallery-bold" width={18} />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle>مكتبة الوسائط</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <Button type="button" variant="secondary" asChild>
                <span>
                  <Icon icon="solar:upload-bold" width={16} className="ms-2" />
                  رفع ملف
                </span>
              </Button>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
            </label>
            {value && (
              <Button type="button" variant="ghost" onClick={() => onChange(null)}>
                إزالة
              </Button>
            )}
          </div>
          {isLoading ? (
            <GridLoadingSkeleton count={4} />
          ) : (
            <div className="grid max-h-80 grid-cols-4 gap-2 overflow-y-auto">
              {data?.data.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onChange(asset.url);
                    setOpen(false);
                  }}
                  className="relative aspect-square overflow-hidden border border-border hover:border-primary"
                >
                  <Image src={asset.url} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
