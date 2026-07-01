"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionForm } from "@/components/cms/CollectionForm";
import { LocalizedInput } from "@/components/cms/LocalizedInput";
import * as projectUnitsApi from "@/lib/api/project-units";
import { tags } from "@/lib/store";
import { projectUnitSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import type { ProjectUnit, ProjectUnitStatus, ProjectUnitType } from "@/lib/types";
import type { z } from "zod";

type FormValues = z.infer<typeof projectUnitSchema>;

const defaults: FormValues = {
  unitNumber: "",
  unitType: "apartment",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  floor: "",
  status: "available",
  description: { ar: "" },
};

const unitTypeLabels: Record<ProjectUnitType, string> = {
  apartment: "شقة",
  villa: "فيلا",
  townhouse: "تاون هاوس",
  office: "مكتب",
  retail: "تجاري",
  other: "أخرى",
};

const unitStatusLabels: Record<ProjectUnitStatus, string> = {
  available: "متاح",
  reserved: "محجوز",
  sold: "مباع",
};

type ProjectUnitFormProps = {
  projectId: string;
  item: ProjectUnit | null;
  onClose: () => void;
};

export function ProjectUnitForm({ projectId, item, onClose }: ProjectUnitFormProps) {
  return (
    <CollectionForm
      schema={projectUnitSchema}
      defaultValues={defaults}
      item={
        item
          ? {
              unitNumber: item.unitNumber,
              unitType: item.unitType,
              bedrooms: item.bedrooms,
              bathrooms: item.bathrooms,
              area: item.area,
              floor: item.floor,
              status: item.status,
              description: item.description,
            }
          : null
      }
      invalidateTags={[...tags.project(projectId), ...tags.projects]}
      onClose={onClose}
      onSubmit={async (values) => {
        if (item) {
          await projectUnitsApi.update(projectId, item.id, values);
        } else {
          await projectUnitsApi.create(projectId, values);
        }
      }}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>رقم الوحدة</Label>
            <Input
              {...form.register("unitNumber")}
              dir="ltr"
              className={ltrInputClass}
              placeholder="A-101"
            />
          </div>
          <div className="space-y-2">
            <Label>نوع الوحدة</Label>
            <Select
              value={form.watch("unitType")}
              onValueChange={(v) => form.setValue("unitType", v as ProjectUnitType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(unitTypeLabels) as ProjectUnitType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {unitTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(v) => form.setValue("status", v as ProjectUnitStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(unitStatusLabels) as ProjectUnitStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {unitStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>غرف النوم</Label>
              <Input
                type="number"
                min={0}
                {...form.register("bedrooms", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>الحمامات</Label>
              <Input
                type="number"
                min={0}
                {...form.register("bathrooms", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>المساحة (م²)</Label>
              <Input
                type="number"
                min={0}
                step="0.1"
                {...form.register("area", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>الطابق</Label>
              <Input
                {...form.register("floor")}
                dir="ltr"
                className={ltrInputClass}
                placeholder="12"
              />
            </div>
          </div>
          <LocalizedInput
            label="الوصف"
            value={form.watch("description")}
            onChange={(v) => form.setValue("description", v)}
            multiline
          />
        </>
      )}
    </CollectionForm>
  );
}

export { unitTypeLabels, unitStatusLabels };
