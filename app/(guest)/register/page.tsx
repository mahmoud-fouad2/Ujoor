import { generateMeta } from "@/lib/utils";
import { GithubIcon } from "lucide-react";
import { Metadata } from "next";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { LocaleToggle } from "@/components/locale-toggle";
import { Button } from "@/components/ui/button";

import { RegisterForm } from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getAppLocale();
  const t = getText(locale);
  return generateMeta({
    title: t.register.metaTitle,
    description: t.register.metaDescription,
  });
}

export default async function RegisterPage() {
  const locale = await getAppLocale();
  const t = getText(locale);

  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <img src={`/images/cover.png`} alt="Cover" className="h-full w-full object-cover" />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className={locale === "ar" ? "flex justify-start" : "flex justify-end"}>
            <LocaleToggle variant="ghost" />
          </div>

          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{t.register.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{t.register.subtitle}</p>
          </div>

          <div className="mt-8 space-y-6">
            <RegisterForm
              locale={locale}
              labels={{
                name: t.register.name,
                namePlaceholder: t.register.namePlaceholder,
                email: t.register.email,
                emailPlaceholder: t.register.emailPlaceholder,
                password: t.register.password,
                passwordPlaceholder: t.register.passwordPlaceholder,
                submit: t.register.submit,
              }}
            />
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-muted px-2 text-gray-500">{t.register.divider}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              {t.register.alreadyHaveAccount}{" "}
              <a href="/login" className="text-primary hover:underline">
                {t.register.loginLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
