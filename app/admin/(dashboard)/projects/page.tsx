"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, queryKeys, useProjects } from "@/lib/hooks/use-cms";
import { projectSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof projectSchema>;

const defaults: FormValues = {
  slug: "",
  name: { ar: "" },
  description: { ar: "" },
  status: "planning",
  published: false,
};

const statusLabels = {
  planning: "تخطيط",
  construction: "قيد الإنشاء",
  completed: "مكتمل",
};

export default function ProjectsPage() {
  const { data: items = [], isLoading } = useProjects();

  return (
    <CollectionEditor<Project>
      title="المشاريع"
      items={items}
      isLoading={isLoading}
      queryKey={queryKeys.projects}
      addLabel="إضافة مشروع"
      getLabel={(item) => item.name.ar}
      columns={[
        { key: "slug", header: "المعرّف", render: (i) => i.slug },
        { key: "name", header: "الاسم", render: (i) => i.name.ar },
        {
          key: "status",
          header: "الحالة",
          render: (i) => (
            <Badge variant="outline">{statusLabels[i.status]}</Badge>
          ),
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
      onDelete={(id) => api.deleteProject(id)}
      renderForm={(item, onClose) => (
        <CollectionForm
          schema={projectSchema}
          defaultValues={defaults}
          item={
            item
              ? {
                  slug: item.slug,
                  name: item.name,
                  description: item.description,
                  status: item.status,
                  published: item.published,
                }
              : null
          }
          queryKey={queryKeys.projects}
          onClose={onClose}
          onSubmit={async (values) => {
            if (item) await api.updateProject(item.id, values);
            else await api.createProject(values);
          }}
        >
          {(form) => (
            <>
              <div className="space-y-2">
                <Label>المعرّف (slug)</Label>
                <Input {...form.register("slug")} dir="ltr" className={ltrInputClass} placeholder="101" />
              </div>
              <LocalizedInput label="الاسم" value={form.watch("name")} onChange={(v) => form.setValue("name", v)} />
              <LocalizedInput label="الوصف" value={form.watch("description")} onChange={(v) => form.setValue("description", v)} multiline />
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(v) => form.setValue("status", v as FormValues["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">تخطيط</SelectItem>
                    <SelectItem value="construction">قيد الإنشاء</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("published")}
                  onCheckedChange={(v) => form.setValue("published", v)}
                />
                <Label>منشور على الموقع</Label>
              </div>
            </>
          )}
        </CollectionForm>
      )}
    />
  );
}
