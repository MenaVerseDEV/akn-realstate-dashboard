"use client";

import { useMemo, useState } from "react";
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
import { iconsMatch, toDisplayIcon } from "@/lib/icons";

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

export const SOCIAL_ICONS = [
  "solar:facebook-bold",
  "solar:instagram-bold",
  "solar:twitter-bold",
  "solar:linkedin-bold",
  "solar:youtube-bold",
  "solar:whatsapp-bold",
  "solar:telegram-bold",
  "solar:tiktok-bold",
  "solar:snapchat-bold",
  "solar:global-bold",
  "solar:link-bold",
  "solar:letter-bold",
  "solar:phone-calling-bold",
];

type IconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
  icons?: string[];
  changeLabel?: string;
  pickLabel?: string;
};

export function IconPicker({
  value,
  onChange,
  icons = SOLAR_ICONS,
  changeLabel = "تغيير",
  pickLabel = "اختر أيقونة",
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const displayValue = toDisplayIcon(value);

  const options = useMemo(() => {
    if (displayValue && !icons.some((icon) => iconsMatch(icon, displayValue))) {
      return [displayValue, ...icons];
    }
    return icons;
  }, [displayValue, icons]);

  const filtered = options.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex items-center gap-3 rounded-none border border-border bg-bg p-3">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center border border-border bg-bg-card",
          !displayValue && "text-muted-foreground",
        )}
      >
        <Icon icon={displayValue || "solar:star-bold"} width={28} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            {displayValue ? changeLabel : pickLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>{pickLabel}</DialogTitle>
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
                  iconsMatch(value, icon) && "border-primary bg-primary/10",
                )}
                title={icon}
              >
                <Icon icon={icon} width={22} />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
