import Image from "next/image";
import Link from "next/link";

import { getAppLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";

export async function MarketingFooter() {
  const year = new Date().getFullYear();
  const locale = await getAppLocale();
  const isAr = locale === "ar";
  const p = locale === "en" ? "/en" : "";

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
          {/* Developer (always left on desktop) */}
          <div className="order-3 flex justify-center sm:order-1 sm:justify-start">
            <Link
              href="https://ma-fo.info"
              className="inline-flex items-center gap-3 opacity-90 hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              <span className="inline-flex items-center rounded-md bg-white/95 px-2 py-1 ring-1 ring-black/10">
                <Image
                  src="https://ma-fo.info/logo2.png"
                  alt={isAr ? "شعار المطور" : "Developer logo"}
                  width={120}
                  height={36}
                  className="h-7 w-auto"
                />
              </span>
              <span className="text-sm text-muted-foreground">
                {t(locale, "footer.developedBy")}
              </span>
            </Link>
          </div>

          {/* Footer nav (center) */}
          <div className="order-2 text-center">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link href={`${p}/privacy`} className="hover:text-foreground">
                {t(locale, "footer.privacy")}
              </Link>
              <span className="opacity-40">•</span>
              <Link href={`${p}/terms`} className="hover:text-foreground">
                {t(locale, "footer.terms")}
              </Link>
              <span className="opacity-40">•</span>
              <Link href={`${p}/support`} className="hover:text-foreground">
                {t(locale, "footer.support")}
              </Link>
            </div>
          </div>

          {/* Copyright (right) */}
          <div className="order-1 text-center sm:order-3 sm:text-end">
            <p className="text-sm text-muted-foreground">
              © {year} {t(locale, "footer.rights")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isAr ? t(locale, "footer.stack.ar") : t(locale, "footer.stack.en")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
