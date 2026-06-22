"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StickySaveBarProps = {
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onCancel?: () => void;
};

export function StickySaveBar({ dirty, saving, onSave, onCancel }: StickySaveBarProps) {
  if (!dirty) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-64 z-50 flex items-center justify-between border-t border-border bg-bg-card px-6 py-4 shadow-lg",
      )}
    >
      <p className="text-sm text-muted">لديك تغييرات غير محفوظة</p>
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            إلغاء
          </Button>
        )}
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
}
