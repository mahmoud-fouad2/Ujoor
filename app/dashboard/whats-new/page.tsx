import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function WhatsNewPage() {
  const locale = await getAppLocale();
  const t = getText(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-start">{t.common.whatsNew}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "آخر التحديثات والتحسينات في النظام."
            : "Latest updates and improvements."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "ar" ? "إصدار تجريبي" : "Preview release"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="text-muted-foreground">
            {locale === "ar"
              ? "هذا محتوى تجريبي الآن. يمكن ربطه لاحقاً بواجهة API أو نظام إصدارات."
              : "This is placeholder content for now. Later it can be driven by an API or releases system."}
          </div>
          <Separator />
          <ul className="list-disc ps-5 text-muted-foreground">
            <li>{locale === "ar" ? "تحسينات في تجربة التنقل" : "Navigation experience improvements"}</li>
            <li>{locale === "ar" ? "قائمة إشعارات احترافية" : "More polished notifications menu"}</li>
            <li>{locale === "ar" ? "روابط مساعدة ودعم" : "Help and support links"}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
