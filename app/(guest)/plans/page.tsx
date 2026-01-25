import type { Metadata } from "next";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/plans",
    titleAr: "تفاصيل الباقات | أجور",
    titleEn: "Plan Details | Ujoors",
    descriptionAr:
      "تفاصيل باقات أجور: ما الذي ستحصل عليه في كل باقة، وما الإضافات المتاحة، وخيارات التوسع للشركات.",
    descriptionEn:
      "Ujoors plan details: what you get in each plan, available add-ons, and scaling options.",
  });
}

const planDetails = [
  {
    nameAr: "الأساسية",
    nameEn: "Starter",
    highlights: [
      "إعداد سريع خلال يوم واحد",
      "موظفين + أقسام + مسميات",
      "حضور وانصراف + إجازات",
      "تقارير أساسية",
    ],
  },
  {
    nameAr: "الأعمال",
    nameEn: "Business",
    highlights: [
      "كل مميزات الأساسية",
      "تشغيل الرواتب",
      "تصدير ملفات WPS",
      "صلاحيات متقدمة + سجلات",
    ],
    popular: true,
  },
  {
    nameAr: "المؤسسات",
    nameEn: "Enterprise",
    highlights: [
      "تكاملات مخصصة (GOSI/WPS/…)",
      "SLA مخصص",
      "مدير حساب",
      "تخصيصات واجهة وتقارير",
    ],
  },
];

const addons = [
  "استيراد بيانات من Excel / CSV",
  "تدريب فريق الموارد البشرية",
  "تخصيص تقارير ولوحات",
  "تكاملات خارجية حسب الطلب",
];

export default function PlansPage() {
  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">تفاصيل الباقات</h1>
          <p className="mt-3 text-muted-foreground">
            هنا التفاصيل بشكل واضح—ولو محتاج تخصيصات على شركتك، بنرتبها معاك.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/pricing">
              <Button variant="outline">رجوع للأسعار</Button>
            </Link>
            <Link href="/request-demo">
              <Button>طلب عرض</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {planDetails.map((p) => (
            <Card key={p.nameEn} className={p.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                <CardTitle className="text-xl">{p.nameAr}</CardTitle>
                <p className="text-sm text-muted-foreground">{p.nameEn}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/request-demo">
                    <Button className="w-full" variant={p.popular ? "default" : "outline"}>
                      تواصل معنا
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">إضافات اختيارية</h2>
            <p className="text-sm text-muted-foreground">خدمات تساعدك في الإطلاق السريع والتوسع.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addons.map((a) => (
              <div key={a} className="rounded-lg border bg-background p-4">
                <p className="text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
