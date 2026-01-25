import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function IdeasPage() {
  const locale = await getAppLocale();
  const t = getText(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.common.shareIdeas}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "شارك اقتراحاتك لتحسين النظام."
            : "Share your suggestions to improve the product."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "اقتراح ميزة" : "Feature request"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "اخبرنا بما تريد إضافته، وسنقوم بتقييمه ضمن خارطة الطريق."
              : "Tell us what you want to add; we’ll evaluate it for the roadmap."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "بلاغ مشكلة" : "Report an issue"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "ar" ? "بلغ عن أي مشكلة مع خطوات إعادة الإنتاج." : "Report any issue with reproduction steps."}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
