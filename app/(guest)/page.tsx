/**
 * Ujoors Landing Page
 * الصفحة الرئيسية للمنصة
 */

import type { Metadata } from "next";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Clock, 
  CreditCard, 
  Shield, 
  Globe,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantAccess } from "@/components/tenant-access";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/",
    titleAr: "أجور | منصة الموارد البشرية والرواتب والحضور",
    titleEn: "Ujoors | HR, Payroll & Attendance Platform",
    descriptionAr:
      "أجور منصة سحابية لإدارة الموظفين والحضور والرواتب مع تجربة عربية/إنجليزية ودعم متعدد الشركات.",
    descriptionEn:
      "Ujoors is a cloud HR platform for employees, attendance and payroll with Arabic/English UX and multi-tenant support.",
  });
}

const features = [
  {
    icon: Users,
    title: "إدارة الموظفين",
    titleEn: "Employee Management",
    description: "إدارة شاملة لبيانات الموظفين والهيكل التنظيمي",
  },
  {
    icon: Clock,
    title: "الحضور والانصراف",
    titleEn: "Time & Attendance",
    description: "تتبع أوقات العمل والشفتات والإجازات بدقة",
  },
  {
    icon: CreditCard,
    title: "إدارة الرواتب",
    titleEn: "Payroll Management",
    description: "حساب الرواتب والبدلات والخصومات تلقائيًا",
  },
  {
    icon: Shield,
    title: "الامتثال السعودي",
    titleEn: "Saudi Compliance",
    description: "تكامل مع GOSI وWPS ومقيم ومدد",
  },
  {
    icon: Globe,
    title: "عربي/إنجليزي",
    titleEn: "Arabic/English",
    description: "واجهة كاملة بالعربية والإنجليزية مع دعم RTL",
  },
  {
    icon: Building2,
    title: "متعدد الشركات",
    titleEn: "Multi-Tenant",
    description: "كل شركة في بيئة منفصلة وآمنة",
  },
];

const plans = [
  {
    name: "Starter",
    nameAr: "الأساسية",
    price: "499",
    employees: "حتى 25 موظف",
    features: ["إدارة الموظفين", "الحضور والانصراف", "الإجازات", "التقارير الأساسية"],
  },
  {
    name: "Business",
    nameAr: "الأعمال",
    price: "999",
    employees: "حتى 100 موظف",
    features: ["كل مميزات Starter", "إدارة الرواتب", "WPS Export", "دعم فني متقدم"],
    popular: true,
  },
  {
    name: "Enterprise",
    nameAr: "المؤسسات",
    price: "تواصل معنا",
    employees: "غير محدود",
    features: ["كل مميزات Business", "تكاملات مخصصة", "API Access", "مدير حساب مخصص"],
  },
];

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const tenantRequired = sp?.tenantRequired === "1";
  const nextPathRaw = sp?.next;
  const nextPath = typeof nextPathRaw === "string" ? nextPathRaw : undefined;

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center sm:py-20">
        {tenantRequired ? (
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border bg-muted/40 p-4 text-right">
            <p className="mb-3 text-sm text-muted-foreground">
              لازم تختار شركتك (Tenant) قبل الدخول للداشبورد على هذا الدومين.
              لو عندك demo tenant استخدم: <span className="font-medium">demo</span>
            </p>
            <TenantAccess nextPath={nextPath} />
          </div>
        ) : null}

        <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          منصة إدارة الموارد البشرية
          <br />
          <span className="text-primary">الأكثر تكاملاً</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          أجور هي منصة سحابية متكاملة لإدارة الموارد البشرية والرواتب والحضور،
          مصممة خصيصًا للسوق السعودي مع الامتثال الكامل للأنظمة المحلية.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/request-demo">
            <Button size="lg" className="gap-2">
              طلب عرض تجريبي
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline">
              اكتشف المميزات
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">مميزات المنصة</h2>
            <p className="text-muted-foreground">كل ما تحتاجه لإدارة فريقك في مكان واحد</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.titleEn}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">الباقات والأسعار</h2>
            <p className="text-muted-foreground">اختر الباقة المناسبة لحجم شركتك</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={plan.popular ? "border-primary shadow-lg" : ""}
              >
                {plan.popular && (
                  <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                    الأكثر طلبًا
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.nameAr}</CardTitle>
                  <CardDescription>{plan.name}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === "تواصل معنا" ? "" : ""}
                      {plan.price}
                    </span>
                    {plan.price !== "تواصل معنا" && (
                      <span className="text-muted-foreground"> ريال/شهر</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.employees}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/request-demo" className="mt-6 block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      طلب اشتراك
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/pricing">
              <Button variant="outline">عرض صفحة الأسعار كاملة</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">جاهز للبدء؟</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            تواصل معنا الآن للحصول على عرض تجريبي مجاني ومعرفة كيف يمكن لأجور 
            تحسين إدارة الموارد البشرية في شركتك.
          </p>
          <Link href="/request-demo">
            <Button size="lg" variant="secondary" className="gap-2">
              طلب عرض تجريبي مجاني
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </main>
  );
}
