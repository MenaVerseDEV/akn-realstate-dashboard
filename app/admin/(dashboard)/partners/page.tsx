"use client";

import Image from "next/image";
import { CollectionEditor } from "@/components/cms/CollectionEditor";
import * as partnersApi from "@/lib/api/partners";
import { usePartners } from "@/lib/hooks/use-cms";
import { tags } from "@/lib/store";
import type { Partner } from "@/lib/types";
import { PartnerForm } from "./PartnerForm";

export default function PartnersPage() {
  const { data: items = [], isLoading } = usePartners();

  return (
    <CollectionEditor<Partner>
      title="الشركاء"
      items={items}
      isLoading={isLoading}
      invalidateTags={tags.partners}
      addLabel="إضافة شريك"
      reorderable
      getLabel={(item) => item.name.ar}
      columns={[
        {
          key: "logo",
          header: "الشعار",
          render: (i) =>
            i.logoUrl ? (
              <Image
                src={i.logoUrl}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                unoptimized
              />
            ) : (
              "—"
            ),
        },
        { key: "name", header: "الاسم", render: (i) => i.name.ar },
      ]}
      onDelete={(id) => partnersApi.deletePartner(id)}
      onReorder={(ids) => partnersApi.reorder(ids)}
      renderForm={(item, onClose) => (
        <PartnerForm item={item} onClose={onClose} itemCount={items.length} />
      )}
    />
  );
}
