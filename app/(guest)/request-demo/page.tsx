/**
 * Request Demo / Subscription Request Page
 * صفحة طلب اشتراك / عرض تجريبي
 */

import { Building2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionRequestForm } from "./subscription-request-form";

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">أجور</span>
            <span className="text-xl font-light text-muted-foreground">Ujoors</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold">طلب اشتراك</h1>
            <p className="text-muted-foreground">
              أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>بيانات الشركة</CardTitle>
              <CardDescription>
                جميع الحقول المطلوبة معلمة بـ *
              </CardDescription>
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
      </main>
    </div>
  );
}
