import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HelpCenterPage() {
  const locale = await getAppLocale();
  const t = getText(locale);

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
    </div>
  );
}
