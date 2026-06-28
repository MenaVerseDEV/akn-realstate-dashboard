import type {
  LocalizedString,
  Project,
  ProjectApi,
  ProjectFormValues,
  ProjectInput,
  ProjectMedia,
  ProjectMediaApi,
  ProjectMediaInput,
  ProjectMediaPatchInput,
  ProjectsListApiResponse,
  ProjectsListParams,
  ProjectsListResult,
} from "@/lib/types";

function parseLocalizedField(
  value: LocalizedString | string,
  fallbackEn?: string,
): LocalizedString {
  if (typeof value === "object" && value !== null && "ar" in value) {
    return {
      ar: value.ar,
      ...(value.en ? { en: value.en } : fallbackEn ? { en: fallbackEn } : {}),
    };
  }

  return {
    ar: typeof value === "string" ? value : "",
    ...(fallbackEn ? { en: fallbackEn } : {}),
  };
}

function localizedEn(value: LocalizedString | string): string | undefined {
  if (typeof value === "object" && value !== null && "en" in value) {
    return value.en;
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

function normalizeProjectMedia(item: ProjectMediaApi | ProjectMedia): ProjectMedia {
  if ("imageUrl" in item || "imagePath" in item) {
    return toProjectMedia(item as ProjectMediaApi);
  }
  return item as ProjectMedia;
}

export function toProjectMedia(api: ProjectMediaApi): ProjectMedia {
  const url =
    typeof api.imageUrl === "string" && api.imageUrl.length > 0
      ? api.imageUrl
      : typeof api.imagePath === "string" && api.imagePath.length > 0
        ? api.imagePath
        : "";

  return {
    id: api.id,
    url,
    type: "image",
    caption: null,
    order: api.order,
  };
}

export function toMediaFormData(input: ProjectMediaInput): FormData {
  const formData = new FormData();
  formData.append("image", input.imageFile, input.imageFile.name);
  formData.append("order", String(input.order));
  return formData;
}

export function toMediaPatchFormData(input: ProjectMediaPatchInput): FormData {
  const formData = new FormData();
  if (input.imageFile instanceof File) {
    formData.append("image", input.imageFile, input.imageFile.name);
  }
  if (input.order !== undefined) {
    formData.append("order", String(input.order));
  }
  return formData;
}

export function toProject(
  api: ProjectApi,
  nameEn?: string,
  descriptionEn?: string,
): Project {
  return {
    id: api.id,
    slug: api.slug,
    name: parseLocalizedField(api.name, nameEn),
    description: parseLocalizedField(api.description, descriptionEn),
    status: api.status,
    published: api.isPublished,
    media: (api.media ?? []).map(normalizeProjectMedia),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mergeProjectLists(
  arResponse: ProjectsListApiResponse,
  enResponse: ProjectsListApiResponse,
): ProjectsListResult {
  const enById = new Map(enResponse.items.map((item) => [item.id, item]));

  const items = arResponse.items.map((arItem) => {
    const enItem = enById.get(arItem.id);
    const nameEn = enItem ? localizedEn(enItem.name) : undefined;
    const descriptionEn = enItem ? localizedEn(enItem.description) : undefined;
    return toProject(arItem, nameEn, descriptionEn);
  });

  return {
    items,
    meta: arResponse.meta,
  };
}

export function toApiInput(values: ProjectFormValues): ProjectInput {
  return {
    slug: values.slug,
    name: {
      ar: values.name.ar,
      ...(values.name.en ? { en: values.name.en } : {}),
    },
    description: {
      ar: values.description.ar,
      ...(values.description.en ? { en: values.description.en } : {}),
    },
    status: values.status,
    isPublished: values.published,
  };
}

export function buildListQuery(params: ProjectsListParams): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }
  if (params.isPublished !== undefined) {
    searchParams.set("isPublished", String(params.isPublished));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
