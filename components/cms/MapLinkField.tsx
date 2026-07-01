"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ltrInputClass } from "@/lib/i18n";
import {
  buildMapLinkFromQuery,
  extractMapQuery,
  isGoogleMapsUrl,
  toMapEmbedUrl,
} from "@/lib/maps";

type MapLinkFieldProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

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

      <Tabs
        value={mode}
        onValueChange={(next) => setMode(next as "search" | "paste")}
        className="gap-3"
      >
        <TabsList>
          <TabsTrigger value="search">بحث عن موقع</TabsTrigger>
          <TabsTrigger value="paste">لصق من Google Maps</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-2">
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
        </TabsContent>

        <TabsContent value="paste" className="space-y-2">
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
        </TabsContent>
      </Tabs>

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
