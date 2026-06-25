export type UploadPreview = {
  url: string;
  name: string;
  size: number;
  isVideo: boolean;
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
}

export function isVideoMedia(fileOrUrl: File | string): boolean {
  if (typeof fileOrUrl === "string") {
    return /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(fileOrUrl);
  }
  return fileOrUrl.type.startsWith("video/");
}

export function createUploadPreview(file: File): UploadPreview {
  return {
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    isVideo: isVideoMedia(file),
  };
}

export function revokeUploadPreview(preview: UploadPreview | null) {
  if (preview?.url.startsWith("blob:")) {
    URL.revokeObjectURL(preview.url);
  }
}
