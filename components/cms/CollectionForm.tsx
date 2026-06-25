"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { baseApi, useAppDispatch, type CacheTag } from "@/lib/store";

type CollectionFormProps<T extends Record<string, unknown>> = {
  schema: z.ZodType<T>;
  defaultValues: T;
  item?: T | null;
  onSubmit: (values: T) => Promise<void>;
  invalidateTags: CacheTag[];
  onClose: () => void;
  children: (form: ReturnType<typeof useForm<T>>) => React.ReactNode;
};

export function CollectionForm<T extends Record<string, unknown>>({
  schema,
  defaultValues,
  item,
  onSubmit,
  invalidateTags,
  onClose,
  children,
}: CollectionFormProps<T>) {
  const dispatch = useAppDispatch();
  const form = useForm<T>({
    resolver: zodResolver(schema as never) as Resolver<T>,
    defaultValues: (item ?? defaultValues) as DefaultValues<T>,
  });

  useEffect(() => {
    form.reset((item ?? defaultValues) as DefaultValues<T>);
  }, [item, defaultValues, form]);

  const handleSubmit = async (values: T) => {
    try {
      await onSubmit(values);
      dispatch(baseApi.util.invalidateTags(invalidateTags));
      toast.success(item ? "تم التحديث" : "تمت الإضافة");
      onClose();
    } catch {
      toast.error("فشل الحفظ");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex min-h-full flex-col"
      >
        <div className="flex-1 space-y-5">{children(form)}</div>
        <div className="sticky bottom-0 -mx-6 mt-6 flex gap-2 border-t border-border bg-bg-card px-6 py-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
}
