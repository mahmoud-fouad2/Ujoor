import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HelpCenterPage() {
  const locale = await getAppLocale();
  const t = getText(locale);
  const p = locale === "en" ? "/en" : "";
  const session = await getServerSession(authOptions);
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

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
          <CardTitle>{locale === "ar" ? "روابط سريعة" : "Quick links"}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <Link className="text-primary hover:underline" href={`${p}/dashboard/employees`}>
              {locale === "ar" ? "إدارة الموظفين" : "Employees"}
            </Link>
            <Link className="text-primary hover:underline" href={`${p}/dashboard/attendance`}>
              {locale === "ar" ? "الحضور والانصراف" : "Attendance"}
            </Link>
            <Link className="text-primary hover:underline" href={`${p}/dashboard/leave-requests`}>
              {locale === "ar" ? "طلبات الإجازات" : "Leave requests"}
            </Link>
            <Link className="text-primary hover:underline" href={`${p}/docs`}>
              {locale === "ar" ? "التوثيق (Docs)" : "Documentation"}
            </Link>
            {isSuperAdmin ? (
              <>
                <Link className="text-primary hover:underline" href={`${p}/dashboard/super-admin/tenants`}>
                  {locale === "ar" ? "لوحة السوبر أدمن: الشركات" : "Super Admin: Tenants"}
                </Link>
                <Link className="text-primary hover:underline" href={`${p}/dashboard/super-admin/pricing`}>
                  {locale === "ar" ? "لوحة السوبر أدمن: الأسعار والباقات" : "Super Admin: Pricing"}
                </Link>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "ar" ? "أسئلة شائعة" : "FAQ"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{locale === "ar" ? "ما الفرق بين الموظفين والمستخدمين؟" : "What's the difference between Employees and Users?"}</p>
            <p>
              {locale === "ar"
                ? "الموظف = ملف موارد بشرية داخل الشركة. المستخدم = حساب تسجيل دخول وصلاحيات. ممكن يكون عندك موظف بدون حساب دخول، أو مستخدم بدون ملف موظف (مثل السوبر أدمن)."
                : "Employee is an HR record inside a tenant. User is a login account with permissions. You can have employees without logins, and users without employee records (e.g. Super Admin)."}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">{locale === "ar" ? "لماذا أرى أخطاء 401؟" : "Why do I see 401 errors?"}</p>
            <p>
              {locale === "ar"
                ? "أخطاء 401 تظهر عندما يتم استدعاء صفحات/واجهات API خاصة بشركة (Tenant) بدون سياق شركة. استخدم لوحة السوبر أدمن لإدارة المنصة، ولوحة الشركة لإدارة بيانات الشركة."
                : "401 happens when tenant-only pages/APIs are called without a tenant context. Use the platform (Super Admin) dashboard for platform management, and a tenant dashboard for tenant data."}
            </p>
          </div>
        </CardContent>
      </Card>

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
