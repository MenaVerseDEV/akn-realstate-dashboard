"use client";

import { Icon } from "@iconify/react";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as featuresApi from "@/lib/api/features";
import { useFeatures } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import { toDisplayIcon } from "@/lib/icons";
import type { Feature } from "@/lib/types";
import { FeatureForm } from "./FeatureForm";

export default function FeaturesPage() {
  const { data: items = [], isLoading } = useFeatures();

  return (
    <CollectionEditor<Feature>
      title="المميزات"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.features}
      addLabel="إضافة ميزة"
      reorderable
      getLabel={(item) => item.title.ar}
      columns={[
        {
          key: "icon",
          header: "الأيقونة",
          render: (i) => <Icon icon={toDisplayIcon(i.icon)} width={18} />,
        },
        { key: "title", header: "العنوان", render: (i) => i.title.ar },
      ]}
      onDelete={(id) => featuresApi.deleteFeature(id)}
      onReorder={(ids) => featuresApi.reorder(ids)}
      renderForm={(item, onClose) => (
        <FeatureForm item={item} onClose={onClose} itemCount={items.length} />
      )}
    />
  );
}
