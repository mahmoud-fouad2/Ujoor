import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { TenantControls } from "@/components/tenant-controls"
import { TenantBadge } from "@/components/tenant-badge"

import data from "./data.json"
import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";

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

  return (
    <>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.heading}</h1>
        <div className="flex items-center gap-3">
          <TenantBadge />
          <TenantControls />
        </div>
      </div>
      <SectionCards locale={locale} />
        <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  )
}
