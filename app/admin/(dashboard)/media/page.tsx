"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GridLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { api, useMedia } from "@/lib/hooks/use-cms";
import { baseApi, tags, useAppDispatch } from "@/lib/store";
import { rtlInputClass } from "@/lib/i18n";
import type { MediaAsset } from "@/lib/types";

export default function MediaLibraryPage() {
  const [typeFilter, setTypeFilter] = useState<"image" | "video" | "all">("all");
  const [deleting, setDeleting] = useState<MediaAsset | null>(null);
  const dispatch = useAppDispatch();

  const filter = typeFilter === "all" ? undefined : typeFilter;
  const { data, isLoading } = useMedia(1, filter);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await api.uploadMedia(file);
      dispatch(baseApi.util.invalidateTags(tags.media));
      toast.success("تم رفع الملف");
    } catch {
      toast.error("فشل الرفع");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.deleteMedia(deleting.id);
      dispatch(baseApi.util.invalidateTags(tags.media));
      setDeleting(null);
      toast.success("تم الحذف");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل الحذف");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-dark">مكتبة الوسائط</h2>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="image">صور</SelectItem>
              <SelectItem value="video">فيديو</SelectItem>
            </SelectContent>
          </Select>
          <label>
            <Button type="button" variant="default" asChild>
              <span>
                <Icon icon="solar:upload-bold" width={18} />
                رفع ملف
              </span>
            </Button>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {isLoading ? (
        <GridLoadingSkeleton count={8} />
      ) : data?.data.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-dashed border-border text-muted-foreground">
          لا توجد وسائط
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data?.data.map((asset) => (
            <div key={asset.id} className="group relative border border-border bg-bg-card">
              <div className="relative aspect-square">
                <Image src={asset.url} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-2 p-3">
                <p className="text-xs text-muted-foreground">{asset.type}</p>
                <Input
                  defaultValue={asset.altText?.ar ?? ""}
                  placeholder="نص بديل"
                  dir="rtl"
                  className={`text-xs ${rtlInputClass}`}
                  onBlur={async (e) => {
                    await api.updateMedia(asset.id, { altText: { ar: e.target.value } });
                    toast.success("تم التحديث");
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive"
                  onClick={() => setDeleting(asset)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
