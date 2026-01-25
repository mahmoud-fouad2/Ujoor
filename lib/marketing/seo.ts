import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

import { getMarketingLocaleFromCookie, getSiteUrl } from "@/lib/marketing/site";

type SeoCopy = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  path: string;
};

export async function marketingMetadata(copy: SeoCopy): Promise<Metadata> {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-ujoors-locale");

  const cookieStore = await cookies();
  const localeFromCookie = getMarketingLocaleFromCookie(cookieStore.get("ujoors_locale")?.value);
  const locale = headerLocale === "en" || headerLocale === "ar" ? headerLocale : localeFromCookie;
  const title = locale === "ar" ? copy.titleAr : copy.titleEn;
  const description = locale === "ar" ? copy.descriptionAr : copy.descriptionEn;

  const base = getSiteUrl();
  const path = copy.path.startsWith("/") ? copy.path : `/${copy.path}`;

  const urlAr = `${base}${path}`;
  const urlEn = path === "/" ? `${base}/en` : `${base}/en${path}`;
  const url = locale === "en" ? urlEn : urlAr;

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: url,
      languages: {
        "ar-SA": urlAr,
        "en-US": urlEn,
      },
    },
    keywords: [
      "HR",
      "Payroll",
      "Attendance",
      "Saudi",
      "WPS",
      "GOSI",
      "Ujoors",
      "أجور",
      "الموارد البشرية",
      "الرواتب",
      "الحضور والانصراف",
    ],
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Ujoors",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [
        {
          url: `${base}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Ujoors",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/twitter-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
    creator: "Ujoors",
    publisher: "Ujoors",
    other: {
      "application-name": "Ujoors",
      "apple-mobile-web-app-title": "Ujoors",
      "theme-color": "#0b1220",
    },
  };
}
