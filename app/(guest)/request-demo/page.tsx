/**
 * Request Demo / Subscription Request Page
 * صفحة طلب اشتراك / عرض تجريبي
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionRequestForm } from "./subscription-request-form";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/request-demo",
    titleAr: "طلب عرض تجريبي | أجور",
    titleEn: "Request a Demo | Ujoors",
    descriptionAr: "اطلب عرض تجريبي لمنصة أجور. املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة.",
    descriptionEn: "Request a demo of Ujoors. Fill the form and our team will contact you within 24 hours.",
  });
}

export default function RequestDemoPage() {
  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold">طلب اشتراك / عرض تجريبي</h1>
            <p className="text-muted-foreground">أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>بيانات الشركة</CardTitle>
              <CardDescription>جميع الحقول المطلوبة معلمة بـ *</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionRequestForm />
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
