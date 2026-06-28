"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import * as projectsApi from "@/lib/api/projects";
import { baseApi, tags, useAppDispatch } from "@/lib/store";
import { ltrInputClass } from "@/lib/i18n";
import type { ProjectMedia } from "@/lib/types";

type ProjectMediaFormProps = {
  projectId: string;
  item: ProjectMedia;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectMediaForm({
  projectId,
  item,
  open,
  onOpenChange,
}: ProjectMediaFormProps) {
  const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [order, setOrder] = useState(String(item.order));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error("يرجى اختيار صورة جديدة");
      return;
    }

    setIsSubmitting(true);
    try {
      await projectsApi.updateMedia(projectId, item.id, {
        imageFile,
        order: Number(order),
      });
      dispatch(baseApi.util.invalidateTags([...tags.project(projectId), ...tags.projects]));
      toast.success("تم تحديث الوسائط");
      setImageFile(null);
      onOpenChange(false);
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>استبدال الصورة</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <MediaDropzone
            accept="image/*"
            onFileSelect={(file) => setImageFile(file)}
            uploadPreviewUrl={imageFile ? URL.createObjectURL(imageFile) : item.url}
            uploadFileName={imageFile?.name ?? null}
          />
          <div className="space-y-2">
            <Label>الترتيب</Label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              dir="ltr"
              className={ltrInputClass}
              min={1}
            />
          </div>
          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting || !imageFile}
            onClick={handleSubmit}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
