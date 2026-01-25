import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getAppLocale } from "@/lib/i18n/locale";

export default async function SettingsProfilePage() {
  const locale = await getAppLocale();
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-start">{isRtl ? "الملف الشخصي" : "Profile"}</h3>
        <p className="text-sm text-muted-foreground text-start">
          {isRtl ? "هكذا سيراك الآخرون داخل النظام." : "This is how others will see you on the site."}
        </p>
      </div>
      <Separator />
      <ProfileForm locale={locale} />
    </div>
  );
}
