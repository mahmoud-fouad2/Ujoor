import Link from "next/link";

import { getAppLocale } from "@/lib/i18n/locale";
import { Button } from "@/components/ui/button";
import { ChangeEmailForm } from "./change-email-form";

export default async function ChangeEmailPage() {
  const locale = await getAppLocale();

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{locale === "ar" ? "تغيير البريد الإلكتروني" : "Change email"}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "قم بتحديث بريدك الإلكتروني المرتبط بالحساب. ستحتاج كلمة المرور الحالية للتأكيد."
            : "Update the email associated with your account. You'll need your current password to confirm."}
        </p>
      </div>

      <ChangeEmailForm locale={locale} />

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/my-profile">{locale === "ar" ? "رجوع" : "Back"}</Link>
        </Button>
      </div>
    </div>
  );
}
