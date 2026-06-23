"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableLoadingSkeleton } from "@/components/cms/LoadingSkeleton";

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
};

type CollectionTableProps<T extends { id: string }> = {
  items: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  addLabel?: string;
};

export function CollectionTable<T extends { id: string }>({
  items,
  columns,
  isLoading,
  emptyMessage = "لا توجد عناصر",
  onEdit,
  onDelete,
  onAdd,
  addLabel = "إضافة",
}: CollectionTableProps<T>) {
  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {onAdd && (
        <div className="flex justify-end">
          <Button type="button" onClick={onAdd}>
            <Icon icon="solar:add-circle-bold" width={18} />
            {addLabel}
          </Button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-dashed border-border bg-muted/30 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.header}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="w-28">إجراءات</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(item)}</TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-1">
                        {onEdit && (
                          <Button type="button" variant="ghost" size="icon-xs" onClick={() => onEdit(item)}>
                            <Icon icon="solar:pen-bold" width={16} />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onDelete(item)}
                            className="text-destructive"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" width={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
