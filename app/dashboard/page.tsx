import { SectionCards } from "@/components/section-cards"
import { TenantControls } from "@/components/tenant-controls"
import { TenantBadge } from "@/components/tenant-badge"
import { RecentActivities } from "@/components/recent-activities"
import { ChartAreaInteractiveClient } from "./chart-area-interactive-client";

import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { requireAuth } from "@/lib/auth";
import { getDashboardActivities, getDashboardCharts, getDashboardStats } from "@/lib/dashboard";

export async function generateMetadata(): Promise<Metadata>{
  const locale = await getAppLocale();
  const t = getText(locale);
  return generateMeta({
    title: t.dashboard.metaTitle,
    description: t.dashboard.metaDescription,
  });
}

export default async function Page() {
  const locale = await getAppLocale();
  const t = getText(locale);
  const user = await requireAuth();

  const [stats, charts, activities] = await Promise.all([
    getDashboardStats(user.tenantId),
    getDashboardCharts({ tenantId: user.tenantId, period: "week" }),
    getDashboardActivities({ tenantId: user.tenantId, limit: 10 }),
  ]);

  return (
    <>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.heading}</h1>
        <div className="flex items-center gap-3">
          <TenantBadge />
          <TenantControls />
        </div>
      </div>
      <SectionCards locale={locale} stats={stats} />
      <div className="grid grid-cols-1 gap-4 @5xl/main:grid-cols-2">
        <ChartAreaInteractiveClient locale={locale} initialAttendance={charts.attendance} />
        <RecentActivities locale={locale} activities={activities} />
      </div>
    </>
  )
}
