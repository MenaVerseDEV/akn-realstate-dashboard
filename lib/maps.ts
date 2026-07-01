const GOOGLE_MAPS_HOSTS = ["google.com", "google.com.sa", "maps.google.com", "www.google.com"];

export function buildMapLinkFromQuery(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "";
  return `https://maps.google.com/?q=${encodeURIComponent(trimmed)}`;
}

export function extractMapQuery(mapLink: string | null | undefined): string {
  if (!mapLink) return "";
  try {
    const url = new URL(mapLink);
    const q = url.searchParams.get("q");
    if (q) return q;
    const place = url.pathname.match(/\/maps\/place\/([^/]+)/)?.[1];
    if (place) return decodeURIComponent(place.replace(/\+/g, " "));
  } catch {
    return "";
  }
  return "";
}

export function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return GOOGLE_MAPS_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function toMapEmbedUrl(mapLink: string | null | undefined): string | null {
  if (!mapLink || !isGoogleMapsUrl(mapLink)) return null;

  try {
    const url = new URL(mapLink);
    const q = url.searchParams.get("q") ?? extractMapQuery(mapLink);
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }

    const embed = new URL(mapLink);
    embed.searchParams.set("output", "embed");
    return embed.toString();
  } catch {
    return null;
  }
}
