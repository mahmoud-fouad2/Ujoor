import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { Metadata } from "next";
import { LocaleToggle } from "@/components/locale-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getAppLocale();
  const t = getText(locale);
  return generateMeta({
    title: t.login.metaTitle,
    description: t.login.metaDescription,
  });
}

export default async function LoginPageV1() {
  const locale = await getAppLocale();
  const t = getText(locale);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <div className="relative flex items-center justify-center px-6 py-10 lg:px-12">
          <div className={locale === "ar" ? "absolute left-6 top-6" : "absolute right-6 top-6"}>
            <LocaleToggle variant="ghost" />
          </div>

          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">{t.login.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t.login.subtitle}</p>
            </div>

            <form className="mt-10 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t.login.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.login.emailPlaceholder}
                  className="h-11"
                  required
                />
              </div>

              <Button type="submit" className="h-11 w-full bg-black text-white hover:bg-black/90">
                {t.login.submit}
              </Button>
            </form>
          </div>
        </div>

        {/* Right: dark marketing panel */}
        <div className="relative hidden overflow-hidden bg-neutral-950 lg:block">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900" />

          <div className="relative flex h-full flex-col justify-center px-14">
            <div className="text-white">
              <div className="text-5xl font-semibold tracking-tight">{t.login.rightTitle}</div>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80">{t.login.rightLead}</p>

              <div className="mt-6 space-y-2 text-lg font-semibold">
                {t.login.rightBullets.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>

              <p className="mt-8 text-sm text-white/80">{t.login.rightHint}</p>
            </div>

            <div className="mt-10 max-w-xl rounded-xl bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">{t.login.promoTitle}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t.login.promoBody}</div>
              <div className="mt-4">
                <Button variant="outline" className="border-black/10">
                  {t.login.promoCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
