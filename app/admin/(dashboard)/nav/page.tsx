"use client";

import { CollectionEditor } from "@/components/cms/CollectionEditor";
import { tags } from "@/lib/store";
import { useDeleteNavMutation, useReorderNavMutation } from "@/lib/store/api";
import { useNav } from "@/lib/hooks/use-cms";
import type { NavLink } from "@/lib/types";
import { NavForm } from "./NavForm";

export default function NavPage() {
  const { data: items = [], isLoading } = useNav();
  const [deleteNav] = useDeleteNavMutation();
  const [reorderNav] = useReorderNavMutation();

  return (
    <CollectionEditor<NavLink>
      title="التنقل"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.nav}
      addLabel="إضافة رابط"
      reorderable
      getLabel={(item) => item.label.ar}
      columns={[
        { key: "label", header: "العنوان", render: (i) => i.label.ar },
        { key: "href", header: "الرابط", render: (i) => i.href },
        { key: "visible", header: "ظاهر", render: (i) => (i.visible ? "نعم" : "لا") },
      ]}
      onDelete={(id) => deleteNav(id).unwrap()}
      onReorder={(ids) => reorderNav(ids).unwrap()}
      renderForm={(item, onClose) => <NavForm item={item} onClose={onClose} />}
    />
  );
}
