"use client";

import { useState } from "react";
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
import { baseApi, useAppDispatch, type CacheTag } from "@/lib/store";

type CollectionEditorProps<T extends { id: string }> = {
  title: string;
  items: T[];
  isLoading?: boolean;
  columns: { key: string; header: string; render: (item: T) => React.ReactNode }[];
  renderForm: (item: T | null, onClose: () => void) => React.ReactNode;
  onDelete: (id: string) => Promise<unknown>;
  onReorder?: (ids: string[]) => Promise<unknown>;
  invalidateTags: CacheTag[];
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
  invalidateTags,
  addLabel,
  reorderable,
  getLabel,
}: CollectionEditorProps<T>) {
  const [editing, setEditing] = useState<T | null | "new">(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [view, setView] = useState<"table" | "reorder">("table");
  const [localItems, setLocalItems] = useState(items);
  const dispatch = useAppDispatch();

  const displayItems = view === "reorder" ? localItems : items;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await onDelete(deleting.id);
      dispatch(baseApi.util.invalidateTags(invalidateTags));
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
      dispatch(baseApi.util.invalidateTags(invalidateTags));
      toast.success("تم تحديث الترتيب");
    } catch {
      toast.error("فشل تحديث الترتيب");
    }
  };

  return (
    <div className="space-y-6">
      {title || (reorderable && items.length > 1) ? (
        <div className="flex items-center justify-between">
          <div>
            {title ? <h2 className="text-2xl font-bold text-dark">{title}</h2> : null}
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
      ) : null}

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
        <SheetContent
          side="left"
          className="flex h-full w-full flex-col gap-0 overflow-hidden rounded-none border-border bg-bg-card p-0 sm:max-w-xl"
        >
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
            <SheetTitle className="pe-10 text-lg font-bold text-dark">
              {editing === "new" ? addLabel ?? "إضافة" : "تعديل"}
            </SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
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
