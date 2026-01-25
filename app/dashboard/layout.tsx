import React from "react";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function Page({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("ujoors_locale")?.value === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const sidebarSide = dir === "rtl" ? "right" : "left";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" side={sidebarSide} />
      <SidebarInset>
        <SiteHeader locale={locale} dir={dir} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4  md:gap-6 p-4 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
