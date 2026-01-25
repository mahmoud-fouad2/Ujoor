import { getAppLocale } from "@/lib/i18n/locale";
import AttendanceSettingsClient from "./attendance-settings-client";

export default async function AttendanceSettingsPage() {
  const locale = await getAppLocale();
  return <AttendanceSettingsClient locale={locale} />;
}
