import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HelpCenterPage() {
  const locale = await getAppLocale();
  const t = getText(locale);
  const p = locale === "en" ? "/en" : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.common.helpCenter}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "ابحث عن إجابات سريعة أو تواصل مع الدعم."
            : "Find quick answers or contact support."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "البدء" : "Getting started"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "إعداد الشركة، إضافة الموظفين، وضبط السياسات."
              : "Set up your company, add employees, and configure policies."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "الموارد البشرية" : "HR"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "الهيكل التنظيمي، الملفات، التوظيف، والتقييم."
              : "Org structure, documents, hiring, and performance."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "الرواتب" : "Payroll"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "مسير الرواتب، القسائم، والخصومات والإضافات."
              : "Runs, payslips, deductions and allowances."}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "ar" ? "الدعم الفني" : "Support"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "إذا واجهت مشكلة داخل النظام، افتح تذكرة دعم وسيتم متابعتها من فريقنا."
              : "If you hit an issue, open a support ticket and our team will follow up."}
          </p>
          <Button asChild>
            <Link href={`${p}/dashboard/support`}>{locale === "ar" ? "فتح / متابعة التذاكر" : "Open / view tickets"}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
