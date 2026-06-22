"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ltrInputClass, rtlInputClass } from "@/lib/i18n";
import type { LocalizedString } from "@/lib/types";

type LocalizedFieldProps = {
  label: string;
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
};

export function LocalizedInput({ label, value, onChange, multiline }: LocalizedFieldProps) {
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs defaultValue="ar" dir="rtl">
        <TabsList>
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="en" dir="ltr" className="font-sans">
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ar" className="mt-2" dir="rtl">
          <Component
            dir="rtl"
            lang="ar"
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            placeholder="النص بالعربية"
            className={cn(rtlInputClass, multiline && "min-h-24")}
          />
        </TabsContent>
        <TabsContent value="en" className="mt-2" dir="ltr">
          <Component
            dir="ltr"
            lang="en"
            value={value.en ?? ""}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder="English text (optional)"
            className={cn(ltrInputClass, "font-sans", multiline && "min-h-24")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function LocalizedTextarea(props: Omit<LocalizedFieldProps, "multiline">) {
  return <LocalizedInput {...props} multiline />;
}
