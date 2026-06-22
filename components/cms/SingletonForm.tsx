"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { StickySaveBar } from "./StickySaveBar";
import { Skeleton } from "@/components/ui/skeleton";

type SingletonFormProps<T extends FieldValues> = {
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  data?: T;
  isLoading?: boolean;
  onSubmit: (values: T) => Promise<void>;
  children: (form: ReturnType<typeof useForm<T>>) => React.ReactNode;
  saving?: boolean;
};

export function SingletonForm<T extends FieldValues>({
  schema,
  defaultValues,
  data,
  isLoading,
  onSubmit,
  children,
  saving,
}: SingletonFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as never) as Resolver<T>,
    defaultValues,
  });

  useEffect(() => {
    if (data) form.reset(data as DefaultValues<T>);
  }, [data, form]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const handleSave = () => form.handleSubmit(onSubmit)();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
        {children(form)}
      </form>
      <StickySaveBar
        dirty={form.formState.isDirty}
        saving={saving}
        onSave={handleSave}
        onCancel={() => data && form.reset(data as DefaultValues<T>)}
      />
    </Form>
  );
}
