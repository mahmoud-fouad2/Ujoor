import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AcademyPage() {
  const locale = await getAppLocale();
  const t = getText(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.common.academy}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "دروس قصيرة ومقالات تساعدك تستخدم النظام بكفاءة."
            : "Short lessons and articles to help you use the system effectively."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "إعداد الشركة" : "Company setup"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar" ? "تعرف على إعدادات الشركة والتهيئة." : "Learn company settings and onboarding."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "دورة الرواتب" : "Payroll run"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar" ? "خطوات تشغيل مسير الرواتب باحتراف." : "Steps to run payroll professionally."}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
