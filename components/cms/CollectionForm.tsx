"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type CollectionFormProps<T extends Record<string, unknown>> = {
  schema: z.ZodType<T>;
  defaultValues: T;
  item?: T | null;
  onSubmit: (values: T) => Promise<void>;
  queryKey: readonly unknown[];
  onClose: () => void;
  children: (form: ReturnType<typeof useForm<T>>) => React.ReactNode;
};

export function CollectionForm<T extends Record<string, unknown>>({
  schema,
  defaultValues,
  item,
  onSubmit,
  queryKey,
  onClose,
  children,
}: CollectionFormProps<T>) {
  const qc = useQueryClient();
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
      await qc.invalidateQueries({ queryKey });
      toast.success(item ? "تم التحديث" : "تمت الإضافة");
      onClose();
    } catch {
      toast.error("فشل الحفظ");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {children(form)}
        <div className="flex gap-2 pt-4">
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
