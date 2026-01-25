import type { Metadata } from "next";
import { marketingMetadata } from "@/lib/marketing/seo";
import { ScreenshotsGallery } from "./gallery";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/screenshots",
    titleAr: "سكرينشوتس | أجور",
    titleEn: "Screenshots | Ujoors",
    descriptionAr: "لقطات من واجهات أجور: لوحة التحكم، الموظفين، والرواتب.",
    descriptionEn: "UI previews of Ujoors: dashboard, employees, and payroll.",
  });
}

const desktopShots = [
  {
    src: "/images/marketing/screenshot-dashboard.svg",
    titleAr: "لوحة التحكم",
    titleEn: "Dashboard",
  },
  {
    src: "/images/marketing/screenshot-employees.svg",
    titleAr: "الموظفين",
    titleEn: "Employees",
  },
  {
    src: "/images/marketing/screenshot-payroll.svg",
    titleAr: "الرواتب",
    titleEn: "Payroll",
  },
];

const mobileShots = [
  {
    src: "/images/marketing/mobile-dashboard.svg",
    titleAr: "موبايل: لوحة التحكم",
    titleEn: "Mobile: Dashboard",
  },
  {
    src: "/images/marketing/mobile-employees.svg",
    titleAr: "موبايل: الموظفين",
    titleEn: "Mobile: Employees",
  },
  {
    src: "/images/marketing/mobile-payroll.svg",
    titleAr: "موبايل: الرواتب",
    titleEn: "Mobile: Payroll",
  },
];

export default function ScreenshotsPage() {
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 start-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-28 start-12 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">سكرينشوتس</h1>
          <p className="mt-3 text-muted-foreground">
            معرض لواجهات أجور — اضغط على أي لقطة للتكبير.
          </p>
        </div>

          <ScreenshotsGallery desktop={desktopShots} mobile={mobileShots} />

          <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
            ملاحظة: هذه لقطات توضيحية محسّنة (SVG). لو عندك لقطات حقيقية من الداشبورد/الموبايل ابعتها وأنا أستبدلها فورًا.
          </p>
        </div>
      </section>
    </main>
  );
}
