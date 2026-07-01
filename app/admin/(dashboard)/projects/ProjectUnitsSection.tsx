"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as projectUnitsApi from "@/lib/api/project-units";
import { useProjectUnits } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import type { Project, ProjectUnitsListParams, UnitsSummary } from "@/lib/types";
import {
  ProjectUnitForm,
  unitStatusLabels,
  unitTypeLabels,
} from "./ProjectUnitForm";

type ProjectUnitsSectionProps = {
  project: Project;
  embedded?: boolean;
};

const defaultParams: ProjectUnitsListParams = {
  page: 1,
  limit: 10,
};

function UnitsSummaryCard({ summary }: { summary: UnitsSummary }) {
  return (
    <div className="mb-4 grid gap-3 border border-border bg-bg p-4 sm:grid-cols-2">
      <div>
        <p className="text-sm font-medium">إجمالي الوحدات: {summary.total}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          متاح: {summary.byStatus.available} / محجوز: {summary.byStatus.reserved} / مباع:{" "}
          {summary.byStatus.sold}
        </p>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>
          شقق: {summary.byType.apartment} | فيلات: {summary.byType.villa} | تاون هاوس:{" "}
          {summary.byType.townhouse}
        </p>
        <p>
          مكاتب: {summary.byType.office} | تجاري: {summary.byType.retail} | أخرى:{" "}
          {summary.byType.other}
        </p>
      </div>
    </div>
  );
}

export function ProjectUnitsSection({ project, embedded = false }: ProjectUnitsSectionProps) {
  const [params, setParams] = useState<ProjectUnitsListParams>(defaultParams);
  const { data, isLoading } = useProjectUnits(project.id, params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className={embedded ? "space-y-6" : "space-y-6 border border-border bg-bg-card p-6"}>
      {project.unitsSummary ? <UnitsSummaryCard summary={project.unitsSummary} /> : null}

      {meta ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            صفحة {meta.page} من {meta.totalPages} — {meta.total} وحدة
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

      <CollectionEditor
        title={embedded ? "" : "وحدات المشروع"}
        items={items}
        isLoading={isLoading}
        invalidateTags={[...tags.project(project.id), ...tags.projects]}
        addLabel="إضافة وحدة"
        getLabel={(item) => item.unitNumber}
        columns={[
          { key: "unitNumber", header: "رقم الوحدة", render: (i) => i.unitNumber },
          {
            key: "unitType",
            header: "النوع",
            render: (i) => unitTypeLabels[i.unitType],
          },
          {
            key: "status",
            header: "الحالة",
            render: (i) => (
              <Badge variant="outline">{unitStatusLabels[i.status]}</Badge>
            ),
          },
          { key: "bedrooms", header: "غرف النوم", render: (i) => i.bedrooms },
          { key: "area", header: "المساحة", render: (i) => `${i.area} م²` },
          { key: "floor", header: "الطابق", render: (i) => i.floor },
        ]}
        onDelete={(id) => projectUnitsApi.deleteUnit(project.id, id)}
        renderForm={(item, onClose) => (
          <ProjectUnitForm projectId={project.id} item={item} onClose={onClose} />
        )}
      />
    </div>
  );
}
