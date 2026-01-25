import type { Metadata } from "next";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { marketingMetadata } from "@/lib/marketing/seo";

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
    features: ["إدارة الموظفين", "الحضور والانصراف", "الإجازات", "التقارير الأساسية"],
  },
  {
    name: "Business",
    nameAr: "الأعمال",
    priceAr: "999",
    priceEn: "999",
    employeesAr: "حتى 100 موظف",
    employeesEn: "Up to 100 employees",
    features: ["كل مميزات Starter", "إدارة الرواتب", "تصدير WPS", "دعم فني متقدم"],
    popular: true,
  },
  {
    name: "Enterprise",
    nameAr: "المؤسسات",
    priceAr: "تواصل معنا",
    priceEn: "Contact us",
    employeesAr: "غير محدود",
    employeesEn: "Unlimited",
    features: ["كل مميزات Business", "تكاملات مخصصة", "API Access", "مدير حساب مخصص"],
  },
];

const comparison = [
  { featureAr: "إدارة الموظفين", starter: true, business: true, enterprise: true },
  { featureAr: "الحضور والانصراف", starter: true, business: true, enterprise: true },
  { featureAr: "الرواتب", starter: false, business: true, enterprise: true },
  { featureAr: "تصدير WPS", starter: false, business: true, enterprise: true },
  { featureAr: "صلاحيات وأدوار", starter: true, business: true, enterprise: true },
  { featureAr: "تكاملات مخصصة", starter: false, business: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">الأسعار</h1>
          <p className="mt-3 text-muted-foreground">باقات مرنة تناسب حجم شركتك. (الأسعار قابلة للتحديث حسب نطاق التطبيق)</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular ? (
                <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">الأكثر طلبًا</div>
              ) : null}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.nameAr}</CardTitle>
                <CardDescription>{plan.name}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.priceAr}</span>
                  {plan.priceAr !== "تواصل معنا" ? <span className="text-muted-foreground"> ريال/شهر</span> : null}
                </div>
                <p className="text-sm text-muted-foreground">{plan.employeesAr}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/request-demo" className="mt-6 block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    طلب اشتراك
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
            <h2 className="text-2xl font-bold">مقارنة سريعة</h2>
            <p className="text-sm text-muted-foreground">جدول مختصر لمساعدتك في اختيار الباقة.</p>
          </div>

          <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الميزة</TableHead>
                  <TableHead className="text-center">Starter</TableHead>
                  <TableHead className="text-center">Business</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((row) => (
                  <TableRow key={row.featureAr}>
                    <TableCell className="font-medium">{row.featureAr}</TableCell>
                    <TableCell className="text-center">{row.starter ? "✓" : "—"}</TableCell>
                    <TableCell className="text-center">{row.business ? "✓" : "—"}</TableCell>
                    <TableCell className="text-center">{row.enterprise ? "✓" : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <Link href="/plans">
              <Button variant="outline">عرض تفاصيل الباقات</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
