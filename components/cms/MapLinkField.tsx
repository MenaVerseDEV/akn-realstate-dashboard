"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ltrInputClass } from "@/lib/i18n";
import {
  buildMapLinkFromQuery,
  extractMapQuery,
  isGoogleMapsUrl,
  toMapEmbedUrl,
} from "@/lib/maps";
import { cn } from "@/lib/utils";

type MapMode = "search" | "paste";

type MapLinkFieldProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

const mapModeOptions: { id: MapMode; label: string; icon: string }[] = [
  { id: "search", label: "بحث عن موقع", icon: "solar:magnifer-linear" },
  { id: "paste", label: "لصق من Google Maps", icon: "solar:link-round-linear" },
];

function MapModeToggle({
  mode,
  onChange,
}: {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}) {
  return (
    <div
      className="inline-flex w-full gap-1 border border-border bg-bg p-1 sm:w-auto"
      role="tablist"
      aria-label="طريقة إدخال الموقع"
    >
      {mapModeOptions.map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:min-w-40",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-bg-card text-dark/75 hover:bg-bg-dark hover:text-dark",
            )}
          >
            <Icon icon={item.icon} width={18} aria-hidden />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function MapLinkField({ label = "رابط الخريطة", value, onChange }: MapLinkFieldProps) {
  const [mode, setMode] = useState<"search" | "paste">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");

  useEffect(() => {
    if (!value) {
      setSearchQuery("");
      setPasteUrl("");
      return;
    }

    const query = extractMapQuery(value);
    if (query && value.startsWith("https://maps.google.com/?q=")) {
      setSearchQuery(query);
      setMode("search");
      return;
    }

    setPasteUrl(value);
    setMode("paste");
  }, [value]);

  const embedUrl = toMapEmbedUrl(value);
  const hasLink = Boolean(value?.trim());

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <MapModeToggle mode={mode} onChange={setMode} />

      {mode === "search" ? (
        <div className="space-y-2" role="tabpanel">
          <p className="text-sm text-muted-foreground">
            اكتب اسم المدينة أو العنوان، ثم اضغط تطبيق لإنشاء رابط الخريطة.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              dir="ltr"
              className={ltrInputClass}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مثال: Cairo, Egypt"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const link = buildMapLinkFromQuery(searchQuery);
                  onChange(link || null);
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => {
                const link = buildMapLinkFromQuery(searchQuery);
                onChange(link || null);
              }}
            >
              تطبيق
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2" role="tabpanel">
          <p className="text-sm text-muted-foreground">
            افتح Google Maps، اختر الموقع، ثم انسخ الرابط من زر مشاركة والصقه هنا.
          </p>
          <Input
            dir="ltr"
            className={ltrInputClass}
            value={pasteUrl}
            onChange={(e) => {
              const next = e.target.value.trim();
              setPasteUrl(e.target.value);
              onChange(next || null);
            }}
            placeholder="https://maps.google.com/..."
          />
          {pasteUrl && !isGoogleMapsUrl(pasteUrl) && (
            <p className="text-sm text-destructive">الرابط لا يبدو كرابط Google Maps صالح.</p>
          )}
        </div>
      )}

      {hasLink && (
        <div className="space-y-2 rounded-md border border-border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <a
              href={value ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              dir="ltr"
            >
              <Icon icon="solar:map-point-bold" width={16} />
              فتح في Google Maps
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPasteUrl("");
                onChange(null);
              }}
            >
              مسح
            </Button>
          </div>
          {embedUrl && (
            <iframe
              title="معاينة الخريطة"
              src={embedUrl}
              className="h-48 w-full border border-border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      )}
    </div>
  );
}
