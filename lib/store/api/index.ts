import "./authApi";
import "./settingsApi";
import "./navApi";
import "./footerApi";
import "./cmsApi";

export { baseApi } from "./baseApi";
export { tags } from "./tags";
export type { CacheTag } from "./tags";
export {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} from "./authApi";
export {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "./settingsApi";
export { useListNavQuery, useGetNavByIdQuery } from "./navApi";
export {
  useGetFooterInfoQuery,
  useUpdateFooterInfoMutation,
  useListFooterServicesQuery,
  useGetFooterServiceByIdQuery,
  useListFooterSocialLinksQuery,
  useGetFooterSocialLinkByIdQuery,
  useGetFooterQuery,
  useUpdateFooterMutation,
} from "./footerApi";
export {
  useGetHeroQuery,
  useUpdateHeroMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectMediaQuery,
  useGetMilestonesQuery,
  useGetMilestoneByIdQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
  useGetValuesQuery,
  useGetValueByIdQuery,
  useGetFeaturesQuery,
  useGetPartnersQuery,
  useGetContactQuery,
  useUpdateContactMutation,
  useGetMediaQuery,
  api,
} from "./cmsApi";
