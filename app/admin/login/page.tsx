"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/hooks/use-cms";
import { loginSchema } from "@/lib/schemas";
import { ltrInputClass } from "@/lib/i18n";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/types";
import { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await login.mutateAsync(values);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <Card className="w-full max-w-md rounded-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center bg-primary text-primary-foreground">
            <Icon icon="solar:buildings-2-bold" width={28} />
          </div>
          <CardTitle className="text-2xl font-bold">أكن العقارية</CardTitle>
          <CardDescription>تسجيل الدخول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" dir="ltr" placeholder="owner@akn.sa" className={ltrInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" className={ltrInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? "جاري الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
