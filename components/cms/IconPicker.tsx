"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ltrInputClass } from "@/lib/i18n";

const SOLAR_ICONS = [
  "solar:home-bold",
  "solar:buildings-bold",
  "solar:shield-check-bold",
  "solar:shield-star-bold-duotone",
  "solar:star-bold",
  "solar:map-point-bold",
  "solar:hand-money-bold",
  "solar:document-bold",
  "solar:eye-bold",
  "solar:flag-2-bold",
  "solar:flag-bold-duotone",
  "solar:rocket-2-bold-duotone",
  "solar:crown-bold-duotone",
  "solar:lamp-bold-duotone",
  "solar:chat-round-check-bold-duotone",
  "solar:leaf-bold-duotone",
  "solar:phone-calling-bold",
  "solar:videocamera-record-bold",
  "solar:gallery-bold",
  "solar:handshake-bold",
  "solar:users-group-rounded-bold",
  "solar:home-smile-bold",
  "solar:settings-bold",
  "solar:instagram-bold",
  "solar:twitter-bold",
  "solar:linkedin-bold",
  "solar:facebook-bold",
];

type IconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = SOLAR_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start gap-2">
          <Icon icon={value || "solar:star-bold"} width={20} />
          {value || "اختر أيقونة"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>اختر أيقونة</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="بحث..."
          dir="ltr"
          className={ltrInputClass}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid max-h-64 grid-cols-5 gap-2 overflow-y-auto">
          {filtered.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => {
                onChange(icon);
                setOpen(false);
              }}
              className={cn(
                "flex size-12 items-center justify-center border border-border transition-colors hover:border-primary hover:bg-primary/5",
                value === icon && "border-primary bg-primary/10",
              )}
            >
              <Icon icon={icon} width={22} />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
