"use client";

import { Icon } from "@iconify/react";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as valuesApi from "@/lib/api/values";
import { useValues } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import { toDisplayIcon } from "@/lib/icons";
import type { Value } from "@/lib/types";
import { ValueForm } from "./ValueForm";

export default function ValuesPage() {
  const { data: items = [], isLoading } = useValues();

  return (
    <CollectionEditor<Value>
      title="القيم"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.values}
      addLabel="إضافة قيمة"
      reorderable
      getLabel={(item) => item.title.ar}
      columns={[
        {
          key: "icon",
          header: "الأيقونة",
          render: (i) => <Icon icon={toDisplayIcon(i.icon)} width={18} />,
        },
        { key: "title", header: "العنوان", render: (i) => i.title.ar },
        { key: "color", header: "اللون", render: (i) => i.color },
      ]}
      onDelete={(id) => valuesApi.deleteValue(id)}
      onReorder={(ids) => valuesApi.reorder(ids)}
      renderForm={(item, onClose) => (
        <ValueForm item={item} onClose={onClose} itemCount={items.length} />
      )}
    />
  );
}
