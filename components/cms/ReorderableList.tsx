"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type ReorderableItem = {
  id: string;
};

type ReorderableListProps<T extends ReorderableItem> = {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
};

function SortableRow<T extends ReorderableItem>({
  item,
  renderItem,
}: {
  item: T;
  renderItem: (item: T) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 border border-border bg-bg-card p-3",
        isDragging && "opacity-50",
      )}
    >
      <button
        type="button"
        className="cursor-grab text-muted hover:text-dark"
        {...attributes}
        {...listeners}
      >
        <Icon icon="solar:hamburger-menu-bold" width={18} />
      </button>
      <div className="flex-1">{renderItem(item)}</div>
    </div>
  );
}

export function ReorderableList<T extends ReorderableItem>({
  items,
  onReorder,
  renderItem,
  className,
}: ReorderableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={cn("space-y-2", className)}>
          {items.map((item) => (
            <SortableRow key={item.id} item={item} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
