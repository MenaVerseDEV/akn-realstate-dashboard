import "./authApi";
import "./settingsApi";
import "./navApi";
import "./footerApi";
import "./cmsApi";
import "./contactInquiriesApi";

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
export {
  useListNavQuery,
  useGetNavByIdQuery,
  useCreateNavMutation,
  useUpdateNavMutation,
  useDeleteNavMutation,
  useReorderNavMutation,
} from "./navApi";
export {
  useGetFooterInfoQuery,
  useUpdateFooterInfoMutation,
  useListFooterServicesQuery,
  useGetFooterServiceByIdQuery,
  useListFooterSocialLinksQuery,
  useGetFooterSocialLinkByIdQuery,
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
  useGetFeatureByIdQuery,
  useGetPartnersQuery,
  useGetPartnerByIdQuery,
  useGetContactQuery,
  useUpdateContactMutation,
} from "./cmsApi";
export {
  useGetContactInquiriesQuery,
  useUpdateContactInquiryStatusMutation,
} from "./contactInquiriesApi";
