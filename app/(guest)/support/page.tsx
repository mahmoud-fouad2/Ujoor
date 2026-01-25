import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/support",
    titleAr: "الدعم الفني | أجور",
    titleEn: "Support | Ujoors",
    descriptionAr: "قنوات الدعم الفني، ساعات العمل، وسياسة الاستجابة حسب الباقة.",
    descriptionEn: "Support channels, working hours, and response policy based on plan.",
  });
}

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@ujoor.app";

  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">الدعم الفني</h1>
          <p className="mt-3 text-muted-foreground">هنا كل طرق التواصل وسياسة الدعم بشكل واضح.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/request-demo">
              <Button>طلب تواصل</Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline">الأسئلة الشائعة</Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>قنوات التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                البريد: <a className="text-foreground underline" href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </p>
              <p>لو عندك شركة بالفعل: شاركنا اسم الشركة (slug) + وصف المشكلة + سكرينشوت.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ساعات العمل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>الأحد – الخميس: 9:00 ص إلى 6:00 م (بتوقيت السعودية)</p>
              <p>الاستجابة تختلف حسب الباقة، ويمكن إضافة SLA لباقة المؤسسات.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>سياسة الاستجابة (مبدئية)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium text-foreground">Starter</p>
                <p className="mt-1">خلال 48 ساعة عمل</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium text-foreground">Business</p>
                <p className="mt-1">خلال 24 ساعة عمل</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium text-foreground">Enterprise</p>
                <p className="mt-1">SLA مخصص + قناة مباشرة</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
