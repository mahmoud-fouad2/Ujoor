import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AppLocale } from "@/lib/i18n/types";
import { getText } from "@/lib/i18n/text";

export function SectionCards({ locale }: { locale: AppLocale }) {
  const t = getText(locale);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.totalRevenue}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.sectionCards.trendingUpThisMonth} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {t.sectionCards.visitorsLast6Months}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.newCustomers}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.sectionCards.downThisPeriod} <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {t.sectionCards.acquisitionNeedsAttention}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.activeAccounts}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.sectionCards.strongUserRetention} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{t.sectionCards.engagementExceedTargets}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t.sectionCards.growthRate}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.sectionCards.steadyPerformanceIncrease} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{t.sectionCards.meetsGrowthProjections}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
