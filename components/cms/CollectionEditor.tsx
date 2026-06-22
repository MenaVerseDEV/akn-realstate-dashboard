"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CollectionTable } from "./CollectionTable";
import { ReorderableList } from "./ReorderableList";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type CollectionEditorProps<T extends { id: string }> = {
  title: string;
  items: T[];
  isLoading?: boolean;
  columns: { key: string; header: string; render: (item: T) => React.ReactNode }[];
  renderForm: (item: T | null, onClose: () => void) => React.ReactNode;
  onDelete: (id: string) => Promise<unknown>;
  onReorder?: (ids: string[]) => Promise<unknown>;
  queryKey: readonly unknown[];
  addLabel?: string;
  reorderable?: boolean;
  getLabel?: (item: T) => string;
};

export function CollectionEditor<T extends { id: string }>({
  title,
  items,
  isLoading,
  columns,
  renderForm,
  onDelete,
  onReorder,
  queryKey,
  addLabel,
  reorderable,
  getLabel,
}: CollectionEditorProps<T>) {
  const [editing, setEditing] = useState<T | null | "new">(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [view, setView] = useState<"table" | "reorder">("table");
  const [localItems, setLocalItems] = useState(items);
  const qc = useQueryClient();

  const displayItems = view === "reorder" ? localItems : items;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await onDelete(deleting.id);
      await qc.invalidateQueries({ queryKey });
      toast.success("تم الحذف");
      setDeleting(null);
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const handleReorder = async (reordered: T[]) => {
    setLocalItems(reordered);
    if (!onReorder) return;
    try {
      await onReorder(reordered.map((i) => i.id));
      await qc.invalidateQueries({ queryKey });
      toast.success("تم تحديث الترتيب");
    } catch {
      toast.error("فشل تحديث الترتيب");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">{title}</h2>
        </div>
        {reorderable && items.length > 1 && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant={view === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("table")}
            >
              جدول
            </Button>
            <Button
              type="button"
              variant={view === "reorder" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLocalItems(items);
                setView("reorder");
              }}
            >
              ترتيب
            </Button>
          </div>
        )}
      </div>

      {view === "reorder" && onReorder ? (
        <ReorderableList
          items={displayItems}
          onReorder={handleReorder}
          renderItem={(item) => (
            <span className="text-sm font-medium">
              {getLabel ? getLabel(item) : item.id}
            </span>
          )}
        />
      ) : (
        <CollectionTable
          items={displayItems}
          columns={columns}
          isLoading={isLoading}
          onAdd={() => setEditing("new")}
          onEdit={(item) => setEditing(item)}
          onDelete={(item) => setDeleting(item)}
          addLabel={addLabel}
        />
      )}

      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing === "new" ? addLabel ?? "إضافة" : "تعديل"}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {editing !== null &&
              renderForm(editing === "new" ? null : editing, () => setEditing(null))}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
