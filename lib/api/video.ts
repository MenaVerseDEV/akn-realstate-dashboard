import { authFetch } from "@/lib/api/fetch-auth";
import { apiUrl, parseApiResponse } from "@/lib/api/parse-response";
import type {
  LocalizedString,
  VideoSection,
  VideoSectionFormValues,
  VideoShowcase,
} from "@/lib/types";

const VIDEO_ID = "video-section";

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  return authFetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

function stringifyLocalized(value: LocalizedString): string {
  return JSON.stringify({
    ar: value.ar,
    ...(value.en ? { en: value.en } : {}),
  });
}

function resolveVideoUrl(api: VideoSection): string | null {
  if (typeof api.videoUrl === "string" && api.videoUrl.length > 0) {
    return api.videoUrl;
  }
  if (typeof api.videoPath === "string" && api.videoPath.length > 0) {
    return api.videoPath;
  }
  return null;
}

function resolveCoverImageUrl(api: VideoSection): string | null {
  if (typeof api.coverImageUrl === "string" && api.coverImageUrl.length > 0) {
    return api.coverImageUrl;
  }
  if (typeof api.coverImagePath === "string" && api.coverImagePath.length > 0) {
    return api.coverImagePath;
  }
  return null;
}

function toVideoShowcase(api: VideoSection): VideoShowcase {
  return {
    id: VIDEO_ID,
    title: api.title,
    description: api.description,
    videoPath: api.videoPath,
    videoUrl: resolveVideoUrl(api),
    coverImagePath: api.coverImagePath,
    coverImageUrl: resolveCoverImageUrl(api),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

function toFormData(values: VideoSectionFormValues): FormData {
  const formData = new FormData();

  formData.append("title", stringifyLocalized(values.title));
  formData.append("description", stringifyLocalized(values.description));

  if (values.videoFile instanceof File) {
    formData.append("video", values.videoFile, values.videoFile.name);
  }

  if (values.coverImageFile instanceof File) {
    formData.append("coverImage", values.coverImageFile, values.coverImageFile.name);
  }

  return formData;
}

export async function getVideo(): Promise<VideoShowcase> {
  const response = await authorizedFetch("/home/video-section", { method: "GET" });
  const data = await parseApiResponse<VideoSection>(response);
  return toVideoShowcase(data);
}

export async function updateVideo(values: VideoSectionFormValues): Promise<VideoShowcase> {
  const response = await authorizedFetch("/home/video-section", {
    method: "PUT",
    body: toFormData(values),
  });
  const data = await parseApiResponse<VideoSection>(response);
  return toVideoShowcase(data);
}
