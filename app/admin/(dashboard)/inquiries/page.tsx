"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableLoadingSkeleton } from "@/components/cms/LoadingSkeleton";
import { useContactInquiries } from "@/lib/hooks/use-cms";
import { ltrInputClass } from "@/lib/i18n";
import { useUpdateContactInquiryStatusMutation } from "@/lib/store/api";
import type { ContactInquiry, ContactInquiryStatus, ContactInquiriesListParams } from "@/lib/types";

const statusLabels: Record<ContactInquiryStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  close: "مغلق",
};

const statusVariants: Record<ContactInquiryStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  contacted: "secondary",
  close: "outline",
};

const defaultParams: ContactInquiriesListParams = {
  page: 1,
  limit: 10,
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function InquiriesPage() {
  const [params, setParams] = useState<ContactInquiriesListParams>(defaultParams);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactInquiryStatusMutation();

  const { data, isLoading } = useContactInquiries(params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  const applySearch = () => {
    setParams((prev) => ({ ...prev, page: 1, search: searchInput.trim() || undefined }));
  };

  const handleStatusChange = async (inquiry: ContactInquiry, status: ContactInquiryStatus) => {
    if (status === inquiry.status) return;

    try {
      await updateStatus({ id: inquiry.id, body: { status } }).unwrap();
      toast.success("تم تحديث الحالة");
      setSelected((prev) => (prev?.id === inquiry.id ? { ...prev, status } : prev));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث الحالة");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">استفسارات التواصل</h2>

      <div className="flex flex-col gap-4 border border-border bg-bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>بحث</Label>
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="ابحث بالاسم، البريد، الهاتف..."
              />
              <Button type="button" variant="outline" onClick={applySearch}>
                بحث
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={params.status ?? "all"}
              onValueChange={(v) =>
                setParams((prev) => ({
                  ...prev,
                  page: 1,
                  status: v === "all" ? "" : (v as ContactInquiryStatus),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="contacted">تم التواصل</SelectItem>
                <SelectItem value="close">مغلق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {meta ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              صفحة {meta.page} من {meta.totalPages} — {meta.total} استفسار
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!meta.hasPrev}
                onClick={() => setParams((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
              >
                السابق
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!meta.hasNext}
                onClick={() => setParams((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
              >
                التالي
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <TableLoadingSkeleton />
      ) : (
        <div className="overflow-hidden border border-border bg-bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>الميزانية</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    لا توجد استفسارات
                  </TableCell>
                </TableRow>
              ) : (
                items.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell dir="ltr" className={ltrInputClass}>
                      {inquiry.phone}
                    </TableCell>
                    <TableCell dir="ltr" className={ltrInputClass}>
                      {inquiry.email}
                    </TableCell>
                    <TableCell>{inquiry.budget}</TableCell>
                    <TableCell>{inquiry.desiredLocation}</TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        disabled={isUpdating}
                        onValueChange={(v) =>
                          handleStatusChange(inquiry, v as ContactInquiryStatus)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue>
                            <Badge variant={statusVariants[inquiry.status]}>
                              {statusLabels[inquiry.status]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">جديد</SelectItem>
                          <SelectItem value="contacted">تم التواصل</SelectItem>
                          <SelectItem value="close">مغلق</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(inquiry)}>
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle>تفاصيل الاستفسار</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">الاسم</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الحالة</p>
                  <Select
                    value={selected.status}
                    disabled={isUpdating}
                    onValueChange={(v) => handleStatusChange(selected, v as ContactInquiryStatus)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="contacted">تم التواصل</SelectItem>
                      <SelectItem value="close">مغلق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-muted-foreground">الهاتف</p>
                  <p dir="ltr" className={ltrInputClass}>
                    {selected.phone}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">البريد</p>
                  <p dir="ltr" className={ltrInputClass}>
                    {selected.email}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">الميزانية</p>
                  <p>{selected.budget}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الموقع المطلوب</p>
                  <p>{selected.desiredLocation}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">الرسالة</p>
                <p className="mt-1 whitespace-pre-wrap rounded-none border border-border bg-bg p-3">
                  {selected.message}
                </p>
              </div>
              {selected.adminNotes ? (
                <div>
                  <p className="text-muted-foreground">ملاحظات الإدارة</p>
                  <p className="mt-1 whitespace-pre-wrap">{selected.adminNotes}</p>
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground">
                أُرسل {formatDate(selected.createdAt)}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
