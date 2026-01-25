import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingMetadata } from "@/lib/marketing/seo";
import { getAppLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    titleAr: "مركز المساعدة | أجور",
    titleEn: "Help Center | Ujoors",
    descriptionAr: "مقالات وإجابات سريعة ودليل استخدام منصة أجور.",
    descriptionEn: "Quick answers, guides, and articles for Ujoors.",
    path: "/help-center",
  });
}

export default async function PublicHelpCenterPage() {
  const locale = await getAppLocale();
  const isAr = locale === "ar";
  const p = locale === "en" ? "/en" : "";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isAr ? "مركز المساعدة" : "Help Center"}</h1>
          <p className="mt-2 text-muted-foreground">
            {isAr
              ? "إرشادات ومقالات سريعة لتبدأ بأجور بشكل احترافي."
              : "Guides and quick articles to get started with Ujoors."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary">
            <Link href={`${p}/support`}>{isAr ? "الدعم الفني" : "Support"}</Link>
          </Button>
          <Button asChild>
            <Link href={`${p}/request-demo`}>{isAr ? "اطلب عرضًا" : "Request a demo"}</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{isAr ? "البدء" : "Getting started"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {isAr
              ? "إعداد الشركة، إضافة الموظفين، وضبط السياسات الأساسية."
              : "Set up your company, add employees, and configure policies."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isAr ? "الحضور والانصراف" : "Attendance"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {isAr
              ? "إعداد الورديات، تسجيل الحضور، والسياسات والتنبيهات."
              : "Shifts, check-in/out, policies, and alerts."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isAr ? "الرواتب" : "Payroll"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {isAr
              ? "إعداد الهياكل، تشغيل المسير، قسائم الرواتب، والملفات."
              : "Structures, payroll runs, payslips, and exports."}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">{isAr ? "هل تحتاج مساعدة داخل النظام؟" : "Need help inside the app?"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "إذا كان لديك حساب، يمكنك فتح تذكرة دعم من داخل لوحة التحكم."
            : "If you have an account, you can open a support ticket from the dashboard."}
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href={`${p}/dashboard/help-center`}>
              {isAr ? "الذهاب إلى مركز المساعدة في الداشبورد" : "Go to dashboard Help Center"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
