import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: () => ({ error: { status: "CUSTOM_ERROR", error: "No baseQuery configured" } }),
  tagTypes: [
    "Settings",
    "Nav",
    "Hero",
    "About",
    "Projects",
    "Project",
    "Milestones",
    "Video",
    "Values",
    "Features",
    "Partners",
    "Contact",
    "Footer",
    "FooterInfo",
    "Media",
    "Auth",
  ],
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
});
