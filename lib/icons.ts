/** Normalize API slug or iconify id for display with @iconify/react */
export function toDisplayIcon(icon: string): string {
  if (!icon) return "";
  if (icon.includes(":")) return icon;
  return `solar:${icon}-bold`;
}

/** Extract API slug from iconify id or plain slug */
export function toApiIcon(icon: string): string {
  if (!icon) return "";
  if (!icon.includes(":")) return icon;

  const withoutPrefix = icon.replace(/^[^:]+:/, "");
  return withoutPrefix.replace(/-bold(-duotone)?$/, "");
}

export function iconsMatch(a: string, b: string): boolean {
  return toDisplayIcon(a) === toDisplayIcon(b);
}
