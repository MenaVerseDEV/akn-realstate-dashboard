"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import { ReorderableList } from "@/components/cms/ReorderableList";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import { ConfirmDeleteDialog } from "@/components/cms/ConfirmDeleteDialog";
import { useProject, useProjectMedia } from "@/lib/hooks/use-cms";
import * as projectsApi from "@/lib/api/projects";
import { baseApi, tags, useAppDispatch } from "@/lib/store";
import type { ProjectMedia } from "@/lib/types";
import { ProjectMediaForm } from "../ProjectMediaForm";
import { ProjectUnitsSection } from "../ProjectUnitsSection";

type ProjectTab = "media" | "units";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: media = [], isLoading: isMediaLoading } = useProjectMedia(id);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ProjectTab>("media");
  const [deleting, setDeleting] = useState<ProjectMedia | null>(null);
  const [editing, setEditing] = useState<ProjectMedia | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const invalidateMedia = () => {
    dispatch(baseApi.util.invalidateTags([...tags.project(id), ...tags.projects]));
  };

  const handleAddMedia = async (file: File) => {
    setIsUploading(true);
    try {
      await projectsApi.addMedia(id, file, media.length + 1);
      invalidateMedia();
      toast.success("تمت إضافة الوسائط");
    } catch {
      toast.error("فشل الإضافة");
    } finally {
      setIsUploading(false);
    }
  };

  if (isProjectLoading) return <PageLoadingSkeleton />;
  if (!project) return <p>المشروع غير موجود</p>;

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
          <p className="text-sm text-muted-foreground">معرّف: {project.slug}</p>
        </div>
      </div>

      <div className="space-y-6 border border-border bg-bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-dark">
            {activeTab === "media" ? "معرض الوسائط" : "وحدات المشروع"}
          </h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={activeTab === "media" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("media")}
            >
              الوسائط
            </Button>
            <Button
              type="button"
              variant={activeTab === "units" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("units")}
            >
              الوحدات
            </Button>
          </div>
        </div>

        {activeTab === "media" ? (
          <>
            <div>
              <MediaDropzone
                accept="image/*"
                isUploading={isUploading}
                onFileSelect={handleAddMedia}
                onInvalidFile={() => toast.error("يرجى اختيار ملف صورة صالح")}
              />
            </div>

            {isMediaLoading ? (
              <PageLoadingSkeleton />
            ) : media.length === 0 ? (
              <p className="text-muted-foreground">لا توجد وسائط بعد</p>
            ) : (
              <ReorderableList
                items={media}
                onReorder={async (reordered) => {
                  try {
                    await projectsApi.reorderMedia(id, reordered.map((m) => m.id));
                    invalidateMedia();
                    toast.success("تم تحديث الترتيب");
                  } catch {
                    toast.error("فشل تحديث الترتيب");
                  }
                }}
                renderItem={(item) => (
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative size-16 overflow-hidden border border-border">
                      <Image src={item.url} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <span className="text-sm text-muted-foreground">ترتيب: {item.order}</span>
                    <div className="ms-auto flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setEditing(item)}
                      >
                        <Icon icon="solar:pen-bold" width={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleting(item)}
                      >
                        <Icon
                          icon="solar:trash-bin-trash-bold"
                          width={16}
                          className="text-destructive"
                        />
                      </Button>
                    </div>
                  </div>
                )}
              />
            )}
          </>
        ) : (
          <ProjectUnitsSection project={project} embedded />
        )}
      </div>

      {editing ? (
        <ProjectMediaForm
          projectId={id}
          item={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await projectsApi.deleteMedia(id, deleting.id);
            invalidateMedia();
            setDeleting(null);
            toast.success("تم الحذف");
          } catch {
            toast.error("فشل الحذف");
          }
        }}
      />
    </div>
  );
}
