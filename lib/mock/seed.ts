import { nanoid } from "nanoid";
import type {
  About,
  Contact,
  Feature,
  Footer,
  Hero,
  MediaAsset,
  Milestone,
  NavLink,
  Partner,
  Project,
  SiteSettings,
  Value,
  VideoShowcase,
} from "@/lib/types";

const now = () => new Date().toISOString();

function loc(ar: string, en?: string) {
  return en ? { ar, en } : { ar };
}

export function createSeedData() {
  const settings: SiteSettings = {
    id: "settings_1",
    siteName: loc("أكن العقارية", "AKN Real Estate"),
    logoUrl: "/images/logo.png",
    defaultLocale: "ar",
    createdAt: now(),
    updatedAt: now(),
  };

  const nav: NavLink[] = [
    { id: "n1", label: loc("الرئيسية"), href: "#hero", order: 0, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n2", label: loc("من نحن"), href: "#about", order: 1, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n3", label: loc("مشاريعنا"), href: "#projects", order: 2, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n4", label: loc("تطلعاتنا"), href: "#aspirations", order: 3, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n5", label: loc("قيمنا"), href: "#values", order: 4, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n6", label: loc("مميزاتنا"), href: "#features", order: 5, visible: true, createdAt: now(), updatedAt: now() },
    { id: "n7", label: loc("شركاؤنا"), href: "#partners", order: 6, visible: true, createdAt: now(), updatedAt: now() },
  ];

  const hero: Hero = {
    id: "hero_1",
    badge: loc("مرفق عقاري معتمد ومسجل"),
    title: loc("نصنع للمستقبل مفاهيم سكنية تليق بتطلعاتك"),
    description: loc(
      "نفخر في أكن العقارية بتقديم وحدات سكنية تجمع بين الأصالة والمعاصرة في أرقى أحياء الرياض، حيث تلتقي الجودة بالفخامة لتصنع لك حياة استثنائية.",
    ),
    primaryCtaLabel: loc("اكتشف عالمنا"),
    primaryCtaHref: "#about",
    secondaryCtaLabel: loc("تواصل معنا"),
    secondaryCtaHref: "#contact",
    backgroundMediaUrl: null,
    stats: [
      { id: "hs1", value: 500, suffix: "+", label: loc("وحدة سكنية منجزة"), icon: "solar:home-smile-bold", order: 0 },
      { id: "hs2", value: 12, suffix: "+", label: loc("موقع استراتيجي"), icon: "solar:map-point-bold", order: 1 },
      { id: "hs3", value: 98, suffix: "%", label: loc("نسبة رضا العملاء"), icon: "solar:star-bold", order: 2 },
    ],
    createdAt: now(),
    updatedAt: now(),
  };

  const about: About = {
    id: "about_1",
    eyebrow: loc("من نحن"),
    title: loc("نبني المستقبل بثقة وخبرة"),
    description: loc(
      "شركة أكن العقارية متخصصة في تطوير المشاريع السكنية الفاخرة في مدينة الرياض، نجمع بين الخبرة العريقة والابتكار المعماري لتقديم وحدات سكنية استثنائية.",
    ),
    imageUrl: "/images/akn/about.jpg",
    cards: [
      {
        id: "ac1",
        title: loc("رؤيتنا"),
        icon: "solar:eye-bold",
        order: 0,
      },
      {
        id: "ac2",
        title: loc("رسالتنا"),
        icon: "solar:flag-2-bold",
        order: 1,
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  };

  const projects: Project[] = [
    {
      id: "p101",
      slug: "101",
      name: loc("مشروع أكن 101"),
      description: loc("مجمع سكني فاخر يضم وحدات متنوعة بتصاميم عصرية ومرافق متكاملة"),
      status: "in_progress",
      published: true,
      media: [
        { id: "pm1", url: "/images/akn/101/WhatsApp Image 2026-05-21 at 10.18.50 AM.jpeg", type: "image", caption: null, order: 0 },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "p102",
      slug: "102",
      name: loc("مشروع أكن 102"),
      description: loc("مشروع سكني متميز بموقع استراتيجي وتشطيبات فاخرة عالية الجودة"),
      status: "in_progress",
      published: true,
      media: [
        { id: "pm2", url: "/images/akn/102/WhatsApp Image 2026-05-21 at 10.18.54 AM.jpeg", type: "image", caption: null, order: 0 },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "p103",
      slug: "103",
      name: loc("مشروع أكن 103"),
      description: loc("أحدث مشاريعنا السكنية بمواصفات استثنائية وتصاميم معمارية مبتكرة"),
      status: "planning",
      published: false,
      media: [],
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const milestones: Milestone[] = [
    {
      id: "m1",
      year: "2026",
      title: loc("إنجاز 10 مشاريع"),
      description: loc("بنهاية عام 2026، نهدف إلى إتمام 10 مشاريع سكنية متكاملة في مدينة الرياض."),
      icon: "solar:flag-bold-duotone",
      order: 0,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "m2",
      year: "2028",
      title: loc("التوسع الإقليمي"),
      description: loc("توسيع نطاق أعمالنا ليشمل مدناً جديدة في المملكة."),
      icon: "solar:rocket-2-bold-duotone",
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "m3",
      year: "2030",
      title: loc("الريادة في المملكة"),
      description: loc("أن نكون رواداً في مجال التطوير العقاري السكني، تماشياً مع رؤية 2030."),
      icon: "solar:crown-bold-duotone",
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const video: VideoShowcase = {
    id: "video_1",
    title: loc("اكتشف عالم أكن"),
    description: loc("شاهد رحلتنا في بناء مستقبل سكني استثنائي"),
    videoUrl: "/images/akn/102/WhatsApp Video 2026-05-21 at 10.18.57 AM.mp4",
    posterUrl: "/images/akn/102/WhatsApp Image 2026-05-21 at 10.18.55 AM (2).jpeg",
    createdAt: now(),
    updatedAt: now(),
  };

  const values: Value[] = [
    { id: "v1", title: loc("الالتزام بالجودة"), description: loc("نطبق أدق معايير الجودة العالمية في جميع مراحل التطوير."), icon: "solar:shield-star-bold-duotone", color: "from-accent/10 to-accent/5", order: 0, createdAt: now(), updatedAt: now() },
    { id: "v2", title: loc("الابتكار المعماري"), description: loc("نبحث عن حلول ذكية وتصاميم عصرية تجمع بين الوظيفة والجمال."), icon: "solar:lamp-bold-duotone", color: "from-primary/10 to-primary-light/10", order: 1, createdAt: now(), updatedAt: now() },
    { id: "v3", title: loc("الشفافية المطلقة"), description: loc("الصدق والشفافية مع عملائنا أساس النجاح المستدام."), icon: "solar:chat-round-check-bold-duotone", color: "from-accent/10 to-primary/5", order: 2, createdAt: now(), updatedAt: now() },
    { id: "v4", title: loc("الاستدامة"), description: loc("نلتزم بتبني تقنيات صديقة للبيئة."), icon: "solar:leaf-bold-duotone", color: "from-primary-light/10 to-accent/5", order: 3, createdAt: now(), updatedAt: now() },
  ];

  const features: Feature[] = [
    { id: "f1", title: loc("جودة البناء"), description: loc("نستخدم أجود المواد وأحدث التقنيات الإنشائية."), icon: "solar:shield-check-bold", order: 0, createdAt: now(), updatedAt: now() },
    { id: "f2", title: loc("تصاميم عصرية"), description: loc("تصاميم معمارية حديثة تجمع بين الجمال والوظيفة."), icon: "solar:home-bold", order: 1, createdAt: now(), updatedAt: now() },
    { id: "f3", title: loc("مواقع استراتيجية"), description: loc("مواقع في أحياء راقية قريبة من الخدمات."), icon: "solar:map-point-bold", order: 2, createdAt: now(), updatedAt: now() },
    { id: "f4", title: loc("أسعار تنافسية"), description: loc("أسعار عادلة مع خيارات تمويل مرنة."), icon: "solar:hand-money-bold", order: 3, createdAt: now(), updatedAt: now() },
    { id: "f5", title: loc("توثيق قانوني كامل"), description: loc("جميع مشاريعنا مرخصة ومعتمدة."), icon: "solar:document-bold", order: 4, createdAt: now(), updatedAt: now() },
    { id: "f6", title: loc("تسليم في الموعد"), description: loc("نلتزم بمواعيد التسليم المحددة."), icon: "solar:stars-bold", order: 5, createdAt: now(), updatedAt: now() },
  ];

  const partners: Partner[] = [
    "SPL سبل", "بترومين", "بنك الرياض", "مصرف الإنماء", "SNB البنك الأهلي", "KFC",
    "LITER لتر", "ايسوزو", "NMC للتسويق", "الجميح للسيارات", "مدارس المطورون", "TBC",
  ].map((name, i) => ({
    id: `pt${i + 1}`,
    name: loc(name),
    logoUrl: null,
    order: i,
    createdAt: now(),
    updatedAt: now(),
  }));

  const contact: Contact = {
    id: "contact_1",
    badge: loc("ابدأ رحلتك العقارية اليوم مع أكن"),
    title: loc("هل أنت مستعد لمستقبل سكني أفضل؟"),
    description: loc("تواصل معنا الآن واحصل على استشارة عقارية مجانية من فريقنا المتخصص."),
    phone: "920015990",
    email: "info@akn.sa",
    mapUrl: null,
    primaryCtaLabel: "اتصل بنا",
    primaryCtaHref: "tel:920015990",
    secondaryCtaLabel: "راسلنا",
    secondaryCtaHref: "mailto:info@akn.sa",
    createdAt: now(),
    updatedAt: now(),
  };

  const footer: Footer = {
    id: "footer_1",
    companyName: loc("شركة أكن العقارية"),
    description: loc("نبني أحلامك بخبرة وثقة، متخصصون في تقديم أرقى المشاريع السكنية في مدينة الرياض."),
    logoUrl: "/images/logo.png",
    address: loc("الرياض، المملكة العربية السعودية"),
    phone: "920015990",
    email: "info@akn.sa",
    services: [
      {
        id: "fs1",
        title: loc("التطوير السكني"),
        link: "/services/residential",
        order: 0,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "fs2",
        title: loc("الاستشارات العقارية"),
        link: "/services/consulting",
        order: 1,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "fs3",
        title: loc("إدارة المشاريع"),
        link: "/services/project-management",
        order: 2,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    socials: [
      {
        id: "sl1",
        platform: "instagram",
        url: "https://instagram.com",
        icon: "solar:instagram-bold",
        order: 0,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "sl2",
        platform: "twitter",
        url: "https://twitter.com",
        icon: "solar:twitter-bold",
        order: 1,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "sl3",
        platform: "linkedin",
        url: "https://linkedin.com",
        icon: "solar:linkedin-bold",
        order: 2,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "sl4",
        platform: "facebook",
        url: "https://facebook.com",
        icon: "solar:facebook-bold",
        order: 3,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  };

  const media: MediaAsset[] = [
    {
      id: "m_1",
      url: "/images/akn/101/WhatsApp Image 2026-05-21 at 10.18.50 AM.jpeg",
      type: "image",
      altText: loc("واجهة مشروع 101"),
      width: 1920,
      height: 1080,
      size: 384210,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "m_2",
      url: "/images/akn/102/WhatsApp Image 2026-05-21 at 10.18.54 AM.jpeg",
      type: "image",
      altText: loc("واجهة مشروع 102"),
      width: 1920,
      height: 1080,
      size: 320000,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  return {
    settings,
    nav,
    hero,
    about,
    projects,
    milestones,
    video,
    values,
    features,
    partners,
    contact,
    footer,
    media,
    authToken: null as string | null,
    newId: () => nanoid(8),
  };
}

export type SeedData = ReturnType<typeof createSeedData>;
