"use client";

import { useState } from "react";
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

type Locale = "ar" | "en";

function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div
      className="inline-flex gap-1 border border-border bg-bg p-1"
      role="tablist"
      aria-label="اختر اللغة"
    >
      {(
        [
          { id: "ar" as const, label: "العربية" },
          { id: "en" as const, label: "English" },
        ] as const
      ).map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            dir={item.id === "en" ? "ltr" : "rtl"}
            onClick={() => onChange(item.id)}
            className={cn(
              "min-w-20 px-3 py-1.5 text-sm font-medium transition-colors",
              item.id === "en" && "font-sans",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-bg-card text-dark/75 hover:bg-bg-dark hover:text-dark",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function LocalizedInput({ label, value, onChange, multiline }: LocalizedFieldProps) {
  const [locale, setLocale] = useState<Locale>("ar");
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <LocaleToggle locale={locale} onChange={setLocale} />
      {locale === "ar" ? (
        <Component
          dir="rtl"
          lang="ar"
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          placeholder="النص بالعربية"
          className={cn(rtlInputClass, multiline && "min-h-24")}
        />
      ) : (
        <Component
          dir="ltr"
          lang="en"
          value={value.en ?? ""}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder="English text (optional)"
          className={cn(ltrInputClass, "font-sans", multiline && "min-h-24")}
        />
      )}
    </div>
  );
}

export function LocalizedTextarea(props: Omit<LocalizedFieldProps, "multiline">) {
  return <LocalizedInput {...props} multiline />;
}
