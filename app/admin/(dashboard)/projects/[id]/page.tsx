"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { api, queryKeys, useProject } from "@/lib/hooks/use-cms";
import type { ProjectMedia } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: project, isLoading } = useProject(id);
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<ProjectMedia | null>(null);
  const [newMediaUrl, setNewMediaUrl] = useState<string | null>(null);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!project) return <p>المشروع غير موجود</p>;

  const handleAddMedia = async () => {
    if (!newMediaUrl) return;
    try {
      await api.addProjectMedia(id, { url: newMediaUrl, type: "image", caption: null });
      await qc.invalidateQueries({ queryKey: queryKeys.project(id) });
      setNewMediaUrl(null);
      toast.success("تمت إضافة الوسائط");
    } catch {
      toast.error("فشل الإضافة");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <Icon icon="solar:arrow-right-bold" width={18} />
            العودة
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-dark">{project.name.ar}</h2>
          <p className="text-sm text-muted">معرّف: {project.slug}</p>
        </div>
      </div>

      <div className="border border-border bg-bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">معرض الوسائط</h3>
        <div className="mb-4 flex items-end gap-4">
          <MediaPicker label="اختر صورة" value={newMediaUrl} onChange={setNewMediaUrl} />
          <Button type="button" onClick={handleAddMedia} disabled={!newMediaUrl}>
            إضافة للمعرض
          </Button>
        </div>

        {project.media.length === 0 ? (
          <p className="text-muted">لا توجد وسائط بعد</p>
        ) : (
          <ReorderableList
            items={project.media}
            onReorder={async (reordered) => {
              await api.reorderProjectMedia(id, reordered.map((m) => m.id));
              await qc.invalidateQueries({ queryKey: queryKeys.project(id) });
              toast.success("تم تحديث الترتيب");
            }}
            renderItem={(media) => (
              <div className="flex flex-1 items-center gap-4">
                <div className="relative size-16 overflow-hidden border border-border">
                  <Image src={media.url} alt="" fill className="object-cover" unoptimized />
                </div>
                <span className="text-sm text-muted">{media.type}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="ms-auto"
                  onClick={() => setDeleting(media)}
                >
                  <Icon icon="solar:trash-bin-trash-bold" width={16} className="text-destructive" />
                </Button>
              </div>
            )}
          />
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await api.deleteProjectMedia(id, deleting.id);
          await qc.invalidateQueries({ queryKey: queryKeys.project(id) });
          setDeleting(null);
          toast.success("تم الحذف");
        }}
      />
    </div>
  );
}
