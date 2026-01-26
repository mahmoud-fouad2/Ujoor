import type { Metadata } from "next";
import { marketingMetadata } from "@/lib/marketing/seo";
import { ScreenshotsGallery } from "./gallery";
import { getAppLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/screenshots",
    titleAr: "استعراض النظام | أجور",
    titleEn: "Product Tour | Ujoors",
    descriptionAr: "معرض لواجهات أجور: لوحة التحكم، الموظفين، الحضور، والرواتب.",
    descriptionEn: "A guided UI tour of Ujoors: dashboard, employees, attendance, and payroll.",
  });
}

const desktopShots = [
  {
    src: "/preview.png",
    titleAr: "لوحة التحكم (معاينة)",
    titleEn: "Dashboard (preview)",
  },
  {
    src: "/preview2.png",
    titleAr: "تقارير ولوحات",
    titleEn: "Reports & insights",
  },
  {
    src: "/images/marketing/screenshot-dashboard.svg",
    titleAr: "الواجهة (توضيحية)",
    titleEn: "UI (illustration)",
  },
  {
    src: "/images/marketing/screenshot-employees.svg",
    titleAr: "الموظفون (توضيحية)",
    titleEn: "Employees (illustration)",
  },
  {
    src: "/images/marketing/screenshot-payroll.svg",
    titleAr: "الرواتب (توضيحية)",
    titleEn: "Payroll (illustration)",
  },
];

const mobileShots = [
  {
    src: "/images/marketing/mobile-dashboard.svg",
    titleAr: "موبايل: لوحة التحكم (توضيحية)",
    titleEn: "Mobile: Dashboard (illustration)",
  },
  {
    src: "/images/marketing/mobile-employees.svg",
    titleAr: "موبايل: الموظفون (توضيحية)",
    titleEn: "Mobile: Employees (illustration)",
  },
  {
    src: "/images/marketing/mobile-payroll.svg",
    titleAr: "موبايل: الرواتب (توضيحية)",
    titleEn: "Mobile: Payroll (illustration)",
  },
];

export default async function ScreenshotsPage() {
  const locale = await getAppLocale();
  const isAr = locale === "ar";

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 start-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-28 start-12 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{isAr ? "استعراض النظام" : "Product tour"}</h1>
          <p className="mt-3 text-muted-foreground">
            {isAr
              ? "معرض لواجهات أجور — اضغط على أي لقطة للتكبير."
              : "A quick look at Ujoors UI — click any item to zoom."}
          </p>
        </div>

          <ScreenshotsGallery locale={locale} desktop={desktopShots} mobile={mobileShots} />
        </div>
      </section>
    </main>
  );
}
