import { cookies } from "next/headers";

export type AppLocale = "ar" | "en";

export async function getAppLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("ujoors_locale")?.value;
  return value === "en" ? "en" : "ar";
}

export function isRtl(locale: AppLocale): boolean {
  return locale === "ar";
}
