export type NavItem = {
  title: string;
  href: string;
  icon: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const adminNavigation: NavGroup[] = [
  {
    label: "عام",
    items: [
      { title: "إعدادات الموقع", href: "/admin/settings", icon: "solar:settings-bold" },
      { title: "التنقل", href: "/admin/nav", icon: "solar:hamburger-menu-bold" },
    ],
  },
  {
    label: "أقسام الصفحة الرئيسية",
    items: [
      { title: "القسم الرئيسي", href: "/admin/hero", icon: "solar:home-bold" },
      { title: "من نحن", href: "/admin/about", icon: "solar:users-group-rounded-bold" },
      { title: "المشاريع", href: "/admin/projects", icon: "solar:buildings-bold" },
      { title: "التطلعات", href: "/admin/milestones", icon: "solar:flag-bold" },
      { title: "الفيديو", href: "/admin/video", icon: "solar:videocamera-record-bold" },
      { title: "القيم", href: "/admin/values", icon: "solar:shield-star-bold" },
      { title: "المميزات", href: "/admin/features", icon: "solar:star-bold" },
      { title: "الشركاء", href: "/admin/partners", icon: "solar:handshake-bold" },
      { title: "التواصل", href: "/admin/contact", icon: "solar:phone-calling-bold" },
    ],
  },
  {
    label: "التذييل",
    items: [
      { title: "التذييل", href: "/admin/footer", icon: "solar:document-text-bold" },
    ],
  },
  {
    label: "المكتبة",
    items: [
      { title: "الوسائط", href: "/admin/media", icon: "solar:gallery-bold" },
    ],
  },
];
