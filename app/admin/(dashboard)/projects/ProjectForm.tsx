"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import { FormLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import * as projectsApi from "@/lib/api/projects";
import { useGetProjectQuery } from "@/lib/store/api";
import { tags } from "@/lib/store";
import { projectSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { Project, ProjectStatus } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof projectSchema>;

const defaults: FormValues = {
  slug: "",
  name: { ar: "" },
  description: { ar: "" },
  status: "planning",
  published: false,
};

type ProjectFormProps = {
  item: Project | null;
  onClose: () => void;
};

export function ProjectForm({ item, onClose }: ProjectFormProps) {
  const { data: hydratedItem, isLoading } = useGetProjectQuery(item?.id ?? "", {
    skip: !item?.id,
  });

  if (item && isLoading) {
    return <FormLoadingSkeleton />;
  }

  const editItem = item ? (hydratedItem ?? item) : null;

  return (
    <CollectionForm
      schema={projectSchema}
      defaultValues={defaults}
      item={
        editItem
          ? {
              slug: editItem.slug,
              name: editItem.name,
              description: editItem.description,
              status: editItem.status,
              published: editItem.published,
            }
          : null
      }
      invalidateTags={tags.projects}
      onClose={onClose}
      onSubmit={async (values) => {
        if (editItem) {
          await projectsApi.update(editItem.id, values);
        } else {
          await projectsApi.create(values);
        }
      }}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>المعرّف (slug)</Label>
            <Input
              {...form.register("slug")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="101"
            />
          </div>
          <LocalizedInput
            label="الاسم"
            value={form.watch("name")}
            onChange={(v) => form.setValue("name", v)}
          />
          <LocalizedInput
            label="الوصف"
            value={form.watch("description")}
            onChange={(v) => form.setValue("description", v)}
            multiline
          />
          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(v) => form.setValue("status", v as ProjectStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">تخطيط</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="in_hold">متوقف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-none border border-border bg-bg p-4">
            <Label htmlFor="project-published" className="font-medium">
              منشور على الموقع
            </Label>
            <Switch
              id="project-published"
              checked={form.watch("published")}
              onCheckedChange={(v) => form.setValue("published", v)}
            />
          </div>
          {editItem ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/admin/projects/${editItem.id}`}>
                <Icon icon="solar:gallery-bold" width={16} />
                إدارة المشروع
              </Link>
            </Button>
          ) : null}
        </>
      )}
    </CollectionForm>
  );
}
