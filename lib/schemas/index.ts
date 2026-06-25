import { z } from "zod";
import { DEFAULT_LANGUAGES } from "@/lib/types";

export const defaultLanguageSchema = z.enum(DEFAULT_LANGUAGES);

export const localizedStringSchema = z.object({
  ar: z.string().min(1, "الحقل العربي مطلوب"),
  en: z.string().optional(),
});

export const optionalLocalizedStringSchema = z.object({
  ar: z.string(),
  en: z.string().optional(),
}).nullable();

export const siteSettingsSchema = z.object({
  siteName: localizedStringSchema,
  logoUrl: z.string().nullable(),
  defaultLocale: defaultLanguageSchema,
  logoFile: z.custom<File | null>().nullable().optional(),
});

export const navLinkSchema = z.object({
  label: localizedStringSchema,
  href: z.string().min(1),
  visible: z.boolean(),
});

export const heroStatSchema = z.object({
  value: z.coerce.number(),
  suffix: z.string(),
  label: localizedStringSchema,
  icon: z.string().min(1),
});

export const heroSchema = z.object({
  badge: localizedStringSchema,
  title: localizedStringSchema,
  description: localizedStringSchema,
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  backgroundMediaUrl: z.string().nullable(),
});

export const aboutCardSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  icon: z.string().min(1),
});

export const aboutSchema = z.object({
  eyebrow: localizedStringSchema,
  title: localizedStringSchema,
  description: localizedStringSchema,
  imageUrl: z.string().nullable(),
});

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: localizedStringSchema,
  description: localizedStringSchema,
  status: z.enum(["planning", "construction", "completed"]),
  published: z.boolean(),
});

export const milestoneSchema = z.object({
  year: z.string().min(1),
  title: localizedStringSchema,
  description: localizedStringSchema,
  icon: z.string().min(1),
});

export const videoSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  videoUrl: z.string().nullable(),
  posterUrl: z.string().nullable(),
});

export const valueSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  icon: z.string().min(1),
  color: z.string().min(1),
});

export const featureSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  icon: z.string().min(1),
});

export const partnerSchema = z.object({
  name: localizedStringSchema,
  logoUrl: z.string().nullable(),
});

export const contactSchema = z.object({
  badge: localizedStringSchema,
  title: localizedStringSchema,
  description: localizedStringSchema,
  phone: z.string().min(1),
  email: z.string().email(),
  mapUrl: z.string().nullable(),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
});

export const footerServiceSchema = z.object({
  title: localizedStringSchema,
  link: z.string().min(1),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
});

export const footerInfoSchema = z.object({
  companyName: localizedStringSchema,
  description: localizedStringSchema,
  address: localizedStringSchema,
  logoUrl: z.string().nullable(),
  logoFile: z.custom<File | null>().nullable().optional(),
  phone: z.string(),
  email: z.string().email(),
});

export const footerSchema = footerInfoSchema;

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const projectMediaSchema = z.object({
  url: z.string().min(1),
  type: z.enum(["image", "video"]),
  caption: optionalLocalizedStringSchema,
});
