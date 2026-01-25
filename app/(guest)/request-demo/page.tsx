/**
 * Request Demo / Subscription Request Page
 * صفحة طلب اشتراك / عرض تجريبي
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionRequestForm } from "./subscription-request-form";
import { marketingMetadata } from "@/lib/marketing/seo";
import { getAppLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/request-demo",
    titleAr: "طلب عرض تجريبي | أجور",
    titleEn: "Request a Demo | Ujoors",
    descriptionAr: "اطلب عرض تجريبي لمنصة أجور. املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة.",
    descriptionEn: "Request a demo of Ujoors. Fill the form and our team will contact you within 24 hours.",
  });
}

export default async function RequestDemoPage() {
  const locale = await getAppLocale();
  const isAr = locale === "ar";
  const p = locale === "en" ? "/en" : "";

  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold">
              {isAr ? "طلب اشتراك / عرض تجريبي" : "Request a demo / subscription"}
            </h1>
            <p className="text-muted-foreground">
              {isAr
                ? "أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة."
                : "Fill the form below and our team will contact you within 24 hours."}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isAr ? "بيانات الشركة" : "Company details"}</CardTitle>
              <CardDescription>{isAr ? "جميع الحقول المطلوبة معلمة بـ *" : "Required fields are marked with *"}</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionRequestForm />
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link href={`${p}/login`} className="text-primary hover:underline">
              {isAr ? "تسجيل الدخول" : "Login"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
