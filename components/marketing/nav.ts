export type MarketingNavItem = {
  href: string;
  labelAr: string;
  labelEn: string;
};

export const marketingNav: MarketingNavItem[] = [
  { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
  { href: "/features", labelAr: "المميزات", labelEn: "Features" },
  { href: "/pricing", labelAr: "الأسعار", labelEn: "Pricing" },
  { href: "/plans", labelAr: "الباقات", labelEn: "Plans" },
  { href: "/screenshots", labelAr: "استعراض النظام", labelEn: "Product Tour" },
  { href: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ" },
  { href: "/help-center", labelAr: "مركز المساعدة", labelEn: "Help Center" },
  { href: "/support", labelAr: "الدعم الفني", labelEn: "Support" }
];
