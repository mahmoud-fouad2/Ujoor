import { SectionCards } from "@/components/section-cards"
import { TenantControls } from "@/components/tenant-controls"
import { TenantBadge } from "@/components/tenant-badge"
import { RecentActivities } from "@/components/recent-activities"
import { Skeleton } from "@/components/ui/skeleton";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import { requireAuth } from "@/lib/auth";
import { getDashboardActivities, getDashboardCharts, getDashboardStats } from "@/lib/dashboard";

const ChartAreaInteractive = dynamic(
  () => import("@/components/chart-area-interactive").then((m) => m.ChartAreaInteractive),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="mt-4 h-[260px] w-full" />
      </div>
    ),
  },
);

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
        <ChartAreaInteractive locale={locale} initialAttendance={charts.attendance} />
        <RecentActivities locale={locale} activities={activities} />
      </div>
    </>
  )
}
