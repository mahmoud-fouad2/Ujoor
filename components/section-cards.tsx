import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AppLocale } from "@/lib/i18n/types";
import { getText } from "@/lib/i18n/text";
import type { DashboardStats } from "@/lib/dashboard";

export function SectionCards({
  locale,
  stats,
}: {
  locale: AppLocale;
  stats: DashboardStats;
}) {
  const t = getText(locale);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.totalEmployees}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEmployees.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {t.sectionCards.activeEmployees}: {stats.activeEmployees.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.attendanceRate}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.attendanceRate}%
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {t.sectionCards.todayAttendance}: {stats.todayAttendance.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.pendingLeaves}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.pendingLeaves.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {t.sectionCards.onLeaveToday}: {stats.onLeaveToday.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.newHiresThisMonth}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.newHiresThisMonth.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {t.sectionCards.departments}: {stats.departments.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
