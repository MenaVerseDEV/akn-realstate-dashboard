"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as projectsApi from "@/lib/api/projects";
import { useProjects } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import type { Project, ProjectStatus, ProjectsListParams } from "@/lib/types";
import { ProjectForm } from "./ProjectForm";

const statusLabels: Record<ProjectStatus, string> = {
  planning: "تخطيط",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  in_hold: "متوقف",
};

const defaultParams: ProjectsListParams = {
  page: 1,
  limit: 10,
};

export default function ProjectsPage() {
  const [params, setParams] = useState<ProjectsListParams>(defaultParams);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useProjects(params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  const applySearch = () => {
    setParams((prev) => ({ ...prev, page: 1, search: searchInput.trim() || undefined }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-border bg-bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>بحث</Label>
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="ابحث عن مشروع..."
              />
              <Button type="button" variant="outline" onClick={applySearch}>
                بحث
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={params.status ?? "all"}
              onValueChange={(v) =>
                setParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: v === "all" ? "" : (v as ProjectStatus),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="planning">تخطيط</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="in_hold">متوقف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>النشر</Label>
            <Select
              value={
                params.isPublished === undefined
                  ? "all"
                  : params.isPublished
                    ? "published"
                    : "unpublished"
              }
              onValueChange={(v) =>
                setParams((prev) => ({
                  ...prev,
                  page: 1,
                  isPublished: v === "all" ? undefined : v === "published",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="unpublished">غير منشور</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {meta ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              صفحة {meta.page} من {meta.totalPages} — {meta.total} مشروع
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!meta.hasPrev}
                onClick={() => setParams((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
              >
                السابق
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!meta.hasNext}
                onClick={() => setParams((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
              >
                التالي
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <CollectionEditor<Project>
        title="المشاريع"
        items={items}
        isLoading={isLoading}
        invalidateTags={tags.projects}
        addLabel="إضافة مشروع"
        getLabel={(item) => item.name.ar}
        columns={[
          { key: "slug", header: "المعرّف", render: (i) => i.slug },
          { key: "name", header: "الاسم", render: (i) => i.name.ar },
          {
            key: "status",
            header: "الحالة",
            render: (i) => <Badge variant="outline">{statusLabels[i.status]}</Badge>,
          },
          {
            key: "published",
            header: "منشور",
            render: (i) => (i.published ? "نعم" : "لا"),
          },
          {
            key: "media",
            header: "الوسائط",
            render: (i) => i.media.length,
          },
          {
            key: "detail",
            header: "التفاصيل",
            render: (i) => (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/projects/${i.id}`}>
                  <Icon icon="solar:gallery-bold" width={16} />
                  إدارة
                </Link>
              </Button>
            ),
          },
        ]}
        onDelete={(id) => projectsApi.deleteProject(id)}
        renderForm={(item, onClose) => <ProjectForm item={item} onClose={onClose} />}
      />
    </div>
  );
}
