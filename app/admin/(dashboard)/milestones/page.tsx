"use client";

import { Icon } from "@iconify/react";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as aspirationsApi from "@/lib/api/aspirations";
import { useMilestones } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import type { Milestone } from "@/lib/types";
import { MilestoneForm } from "./MilestoneForm";

export default function MilestonesPage() {
  const { data: items = [], isLoading } = useMilestones();

  return (
    <CollectionEditor<Milestone>
      title="التطلعات"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.milestones}
      addLabel="إضافة تطلع"
      reorderable
      getLabel={(item) => `${item.year} — ${item.title.ar}`}
      columns={[
        { key: "year", header: "السنة", render: (i) => i.year },
        {
          key: "icon",
          header: "الأيقونة",
          render: (i) => <Icon icon={i.icon} width={18} />,
        },
        { key: "title", header: "العنوان", render: (i) => i.title.ar },
      ]}
      onDelete={(id) => aspirationsApi.deleteAspiration(id)}
      onReorder={(ids) => aspirationsApi.reorder(ids)}
      renderForm={(item, onClose) => (
        <MilestoneForm item={item} onClose={onClose} itemCount={items.length} />
      )}
    />
  );
}
