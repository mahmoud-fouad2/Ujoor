import type { Metadata } from "next";
import Link from "next/link";

import { Building2, Clock, CreditCard, Globe, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/features",
    titleAr: "مميزات أجور | منصة موارد بشرية ورواتب وحضور",
    titleEn: "Ujoors Features | HR, Payroll & Attendance",
    descriptionAr:
      "استكشف مميزات أجور: إدارة موظفين، حضور وانصراف، رواتب، امتثال سعودي، تقارير، وصلاحيات متعددة داخل نظام متعدد الشركات.",
    descriptionEn:
      "Explore Ujoors features: employees, attendance, payroll, Saudi compliance, reports, RBAC, and multi-tenant architecture.",
  });
}

const featureSections = [
  {
    titleAr: "الأساسيات",
    titleEn: "Core",
    items: [
      {
        icon: Users,
        titleAr: "إدارة الموظفين",
        titleEn: "Employee Management",
        descAr: "ملف موظف، بيانات تعيين، حالة، وتتبع تغييرات.",
        descEn: "Employee profile, hiring data, status, and history.",
      },
      {
        icon: Building2,
        titleAr: "هيكل الشركة",
        titleEn: "Org Structure",
        descAr: "أقسام ومسميات وظيفية وتوزيع الموظفين.",
        descEn: "Departments, job titles and employee assignment.",
      },
      {
        icon: Clock,
        titleAr: "الحضور والانصراف",
        titleEn: "Time & Attendance",
        descAr: "سجلات حضور، شِفتات، وتأخيرات.",
        descEn: "Attendance logs, shifts, and tardiness.",
      },
    ],
  },
  {
    titleAr: "الرواتب والامتثال",
    titleEn: "Payroll & Compliance",
    items: [
      {
        icon: CreditCard,
        titleAr: "إدارة الرواتب",
        titleEn: "Payroll",
        descAr: "تشغيل الرواتب، كشوفات، واستحقاقات/استقطاعات.",
        descEn: "Run payroll, payslips, allowances & deductions.",
      },
      {
        icon: Shield,
        titleAr: "امتثال سعودي",
        titleEn: "Saudi Compliance",
        descAr: "تهيئة لتكاملات مثل GOSI/WPS حسب احتياجك.",
        descEn: "Designed for integrations like GOSI/WPS as needed.",
      },
      {
        icon: Globe,
        titleAr: "عربي / إنجليزي",
        titleEn: "Arabic / English",
        descAr: "RTL/LTR وتجربة مناسبة للسوق المحلي.",
        descEn: "RTL/LTR with localized UX.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">مميزات أجور</h1>
          <p className="mt-3 text-muted-foreground">
            كل ما تحتاجه لإدارة الموارد البشرية والرواتب والحضور في منصة واحدة.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/pricing">
              <Button>عرض الأسعار</Button>
            </Link>
            <Link href="/request-demo">
              <Button variant="outline">طلب عرض</Button>
            </Link>
          </div>
        </div>
      </section>

      {featureSections.map((section) => (
        <section key={section.titleEn} className="border-t py-14">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">{section.titleAr}</h2>
              <p className="text-sm text-muted-foreground">{section.titleEn}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Card key={item.titleEn}>
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{item.titleAr}</CardTitle>
                    <CardDescription>{item.titleEn}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.descAr}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t bg-muted/30 py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">جاهز تبدأ؟</h2>
            <p className="mt-2 text-muted-foreground">خلّينا نعمل Demo ونظبطها حسب شركتك.</p>
            <div className="mt-6">
              <Link href="/request-demo">
                <Button size="lg">طلب عرض تجريبي</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
