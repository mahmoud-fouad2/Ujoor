import type { Metadata } from "next";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { marketingMetadata } from "@/lib/marketing/seo";
import { getAppLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/pricing",
    titleAr: "الأسعار | باقات أجور",
    titleEn: "Pricing | Ujoors Plans",
    descriptionAr:
      "اختر الباقة المناسبة لحجم شركتك: Starter, Business, Enterprise. أسعار واضحة ومزايا قابلة للتوسّع.",
    descriptionEn:
      "Choose the right plan for your company: Starter, Business, Enterprise. Clear pricing and scalable features.",
  });
}

const plans = [
  {
    name: "Starter",
    nameAr: "الأساسية",
    priceAr: "499",
    priceEn: "499",
    employeesAr: "حتى 25 موظف",
    employeesEn: "Up to 25 employees",
    featuresAr: ["إدارة الموظفين", "الحضور والانصراف", "الإجازات", "التقارير الأساسية"],
    featuresEn: ["Employee management", "Time & attendance", "Leave management", "Basic reports"],
  },
  {
    name: "Business",
    nameAr: "الأعمال",
    priceAr: "999",
    priceEn: "999",
    employeesAr: "حتى 100 موظف",
    employeesEn: "Up to 100 employees",
    featuresAr: ["كل مميزات الأساسية", "إدارة الرواتب", "تصدير WPS", "دعم فني متقدم"],
    featuresEn: ["Everything in Starter", "Payroll", "WPS export", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    nameAr: "المؤسسات",
    priceAr: "تواصل معنا",
    priceEn: "Contact us",
    employeesAr: "غير محدود",
    employeesEn: "Unlimited",
    featuresAr: ["كل مميزات الأعمال", "تكاملات مخصصة", "وصول API", "مدير حساب مخصص"],
    featuresEn: ["Everything in Business", "Custom integrations", "API access", "Dedicated account manager"],
  },
];

const comparison = [
  { featureAr: "إدارة الموظفين", featureEn: "Employee management", starter: true, business: true, enterprise: true },
  { featureAr: "الحضور والانصراف", featureEn: "Time & attendance", starter: true, business: true, enterprise: true },
  { featureAr: "الرواتب", featureEn: "Payroll", starter: false, business: true, enterprise: true },
  { featureAr: "تصدير WPS", featureEn: "WPS export", starter: false, business: true, enterprise: true },
  { featureAr: "صلاحيات وأدوار", featureEn: "Roles & permissions", starter: true, business: true, enterprise: true },
  { featureAr: "تكاملات مخصصة", featureEn: "Custom integrations", starter: false, business: false, enterprise: true },
];

export default async function PricingPage() {
  const locale = await getAppLocale();
  const isAr = locale === "ar";
  const p = locale === "en" ? "/en" : "";

  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{isAr ? "الأسعار" : "Pricing"}</h1>
          <p className="mt-3 text-muted-foreground">
            {isAr
              ? "باقات مرنة تناسب حجم شركتك. (الأسعار قابلة للتحديث حسب نطاق التطبيق)"
              : "Flexible plans that fit your company size. (Pricing may vary based on scope)"}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular ? (
                <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                  {isAr ? "الأكثر طلبًا" : "Most popular"}
                </div>
              ) : null}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isAr ? plan.nameAr : plan.name}</CardTitle>
                <CardDescription>{isAr ? plan.name : plan.nameAr}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{isAr ? plan.priceAr : plan.priceEn}</span>
                  {(isAr ? plan.priceAr : plan.priceEn) !== (isAr ? "تواصل معنا" : "Contact us") ? (
                    <span className="text-muted-foreground">{isAr ? " ريال/شهر" : " SAR / month"}</span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{isAr ? plan.employeesAr : plan.employeesEn}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(isAr ? plan.featuresAr : plan.featuresEn).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`${p}/request-demo`} className="mt-6 block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {isAr ? "طلب اشتراك" : "Request subscription"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{isAr ? "مقارنة سريعة" : "Quick comparison"}</h2>
            <p className="text-sm text-muted-foreground">
              {isAr ? "جدول مختصر لمساعدتك في اختيار الباقة." : "A compact table to help you choose."}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isAr ? "الميزة" : "Feature"}</TableHead>
                  <TableHead className="text-center">Starter</TableHead>
                  <TableHead className="text-center">Business</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((row) => (
                  <TableRow key={row.featureEn}>
                    <TableCell className="font-medium">{isAr ? row.featureAr : row.featureEn}</TableCell>
                    <TableCell className="text-center">{row.starter ? "✓" : "—"}</TableCell>
                    <TableCell className="text-center">{row.business ? "✓" : "—"}</TableCell>
                    <TableCell className="text-center">{row.enterprise ? "✓" : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <Link href={`${p}/plans`}>
              <Button variant="outline">{isAr ? "عرض تفاصيل الباقات" : "View plan details"}</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
