/**
 * Ujoors Landing Page
 * الصفحة الرئيسية للمنصة
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import { getAppLocale } from "@/lib/i18n/locale";

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
  const locale = await getAppLocale();
  const isAr = locale === "ar";
  const p = locale === "en" ? "/en" : "";

  const sp = searchParams ? await searchParams : undefined;
  const tenantRequired = sp?.tenantRequired === "1";
  const nextPathRaw = sp?.next;
  const nextPath = typeof nextPathRaw === "string" ? nextPathRaw : undefined;

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        {tenantRequired ? (
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border bg-muted/40 p-4 text-start">
            <p className="mb-3 text-sm text-muted-foreground">
              {isAr ? (
                <>
                  لازم تختار شركتك (Tenant) قبل الدخول للداشبورد على هذا الدومين. لو عندك demo tenant استخدم:{" "}
                  <span className="font-medium">demo</span>
                </>
              ) : (
                <>
                  You need to select your tenant before entering the dashboard on this domain. For a demo tenant use:{" "}
                  <span className="font-medium">demo</span>
                </>
              )}
            </p>
            <TenantAccess nextPath={nextPath} />
          </div>
        ) : null}

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1 text-xs text-muted-foreground shadow-sm lg:mx-0">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {isAr ? "سحابية • متعددة الشركات • عربي/إنجليزي" : "Cloud • Multi-tenant • Arabic/English"}
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {isAr ? (
                <>
                  منصة إدارة الموارد البشرية
                  <br />
                  <span className="text-primary">الأكثر تكاملاً</span>
                </>
              ) : (
                <>
                  HR, Payroll & Attendance
                  <br />
                  <span className="text-primary">built for Saudi compliance</span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground lg:mx-0">
              {isAr
                ? "أجور منصة سحابية متكاملة لإدارة الموارد البشرية والرواتب والحضور، مصممة للسوق السعودي مع تجربة عربية/إنجليزية وامتثال للأنظمة المحلية."
                : "Ujoors is a modern cloud platform to manage employees, shifts, attendance and payroll—optimized for Saudi market needs with RTL-ready Arabic/English UX."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href={`${p}/request-demo`}>
                <Button size="lg" className="gap-2">
                  {isAr ? "طلب عرض تجريبي" : "Request a demo"}
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
              <Link href={`${p}/features`}>
                <Button size="lg" variant="outline">
                  {isAr ? "استكشف المميزات" : "Explore features"}
                </Button>
              </Link>
              <Link href={`${p}/screenshots`}>
                <Button size="lg" variant="secondary">
                  {isAr ? "استعراض النظام" : "Product tour"}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/15 via-blue-500/10 to-purple-500/10 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/10">
              <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="ms-auto text-xs text-muted-foreground">Ujoors • Dashboard preview</div>
              </div>
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src="/preview.png"
                  alt={isAr ? "معاينة لوحة التحكم" : "Dashboard preview"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                <Image
                  src="/preview2.png"
                  alt={isAr ? "لقطة من النظام" : "Product screenshot"}
                  fill
                  className="object-cover"
                  sizes="180px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxMTE4MjciIHN0b3Atb3BhY2l0eT0iMC42Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMWYyOTM3IiBzdG9wLW9wYWNpdHk9IjAuNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                <Image
                  src="/seo.jpg"
                  alt={isAr ? "واجهة تسويقية" : "Marketing visual"}
                  fill
                  className="object-cover"
                  sizes="180px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxMTE4MjciIHN0b3Atb3BhY2l0eT0iMC42Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMWYyOTM3IiBzdG9wLW9wYWNpdHk9IjAuNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                <Image
                  src="/images/cover.png"
                  alt={isAr ? "صورة الغلاف" : "Cover image"}
                  fill
                  className="object-cover"
                  sizes="180px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxMTE4MjciIHN0b3Atb3BhY2l0eT0iMC42Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMWYyOTM3IiBzdG9wLW9wYWNpdHk9IjAuNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">{isAr ? "مميزات المنصة" : "Platform features"}</h2>
            <p className="text-muted-foreground">
              {isAr ? "كل ما تحتاجه لإدارة فريقك في مكان واحد" : "Everything you need to run HR and payroll in one place"}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{isAr ? feature.title : feature.titleEn}</CardTitle>
                  <CardDescription>{isAr ? feature.titleEn : feature.title}</CardDescription>
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
            <h2 className="mb-4 text-3xl font-bold">{isAr ? "الباقات والأسعار" : "Plans & pricing"}</h2>
            <p className="text-muted-foreground">{isAr ? "اختر الباقة المناسبة لحجم شركتك" : "Pick a plan that fits your team"}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={plan.popular ? "border-primary shadow-lg" : ""}
              >
                {plan.popular && (
                  <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                    {isAr ? "الأكثر طلبًا" : "Most popular"}
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{isAr ? plan.nameAr : plan.name}</CardTitle>
                  <CardDescription>{isAr ? plan.name : plan.nameAr}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === "تواصل معنا" ? "" : ""}
                      {plan.price}
                    </span>
                    {plan.price !== "تواصل معنا" && (
                      <span className="text-muted-foreground">{isAr ? " ريال/شهر" : " SAR / month"}</span>
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
                  <Link href={`${p}/request-demo`} className="mt-6 block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {isAr ? "طلب اشتراك" : "Get started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={`${p}/pricing`}>
              <Button variant="outline">{isAr ? "عرض صفحة الأسعار كاملة" : "View full pricing"}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">{isAr ? "جاهز للبدء؟" : "Ready to get started?"}</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            {isAr
              ? "تواصل معنا الآن للحصول على عرض تجريبي مجاني ومعرفة كيف يمكن لأجور تحسين إدارة الموارد البشرية في شركتك."
              : "Talk to us for a free demo and see how Ujoors can streamline HR and payroll operations."}
          </p>
          <Link href={`${p}/request-demo`}>
            <Button size="lg" variant="secondary" className="gap-2">
              {isAr ? "طلب عرض تجريبي مجاني" : "Request a free demo"}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </section>

    </main>
  );
}
