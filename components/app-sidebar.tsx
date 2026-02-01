"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { getSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Safe locale getter - returns default during SSR
function useLocale(): "ar" | "en" {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  
  useEffect(() => {
    const lang = document.documentElement.lang;
    setLocale(lang === "en" ? "en" : "ar");
  }, []);
  
  return locale;
}

function getCookieValue(cookieName: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

type NavItem = { title: string; url: string; icon: any };

function getNav(locale: "ar" | "en", role?: string, hasTenant?: boolean): NavItem[] {
  const p = locale === "en" ? "/en" : "";

  // SUPER_ADMIN without tenant context: avoid tenant-only pages that will redirect to landing.
  if (role === "SUPER_ADMIN" && !hasTenant) {
    return [
      {
        title: locale === "ar" ? "لوحة تحكم السوبر أدمن" : "Super Admin",
        url: `${p}/dashboard/super-admin`,
        icon: IconDashboard,
      },
      {
        title: locale === "ar" ? "طلبات الاشتراك (Super Admin)" : "Subscription Requests (Super Admin)",
        url: `${p}/dashboard/super-admin/requests`,
        icon: IconListDetails,
      },
      {
        title: locale === "ar" ? "الشركات (Super Admin)" : "Tenants (Super Admin)",
        url: `${p}/dashboard/super-admin/tenants`,
        icon: IconUsers,
      },
    ];
  }

  return [
    {
      title: locale === "ar" ? "الرئيسية" : "Dashboard",
      url: `${p}/dashboard`,
      icon: IconDashboard,
    },
    {
      title: locale === "ar" ? "طلبات الاشتراك (Super Admin)" : "Subscription Requests (Super Admin)",
      url: `${p}/dashboard/super-admin/requests`,
      icon: IconListDetails,
    },
    {
      title: locale === "ar" ? "الشركات (Super Admin)" : "Tenants (Super Admin)",
      url: `${p}/dashboard/super-admin/tenants`,
      icon: IconUsers,
    },
    {
      title: locale === "ar" ? "الموظفون" : "Employees",
      url: `${p}/dashboard/employees`,
      icon: IconChartBar,
    },
    {
      title: locale === "ar" ? "الأقسام" : "Departments",
      url: `${p}/dashboard/departments`,
      icon: IconFolder,
    },
    {
      title: locale === "ar" ? "المسميات الوظيفية" : "Job Titles",
      url: `${p}/dashboard/job-titles`,
      icon: IconFolder,
    },
    {
      title: locale === "ar" ? "الهيكل التنظيمي" : "Organization",
      url: `${p}/dashboard/organization`,
      icon: IconFolder,
    },
    {
      title: locale === "ar" ? "المستخدمون" : "Users",
      url: `${p}/dashboard/users`,
      icon: IconUsers,
    },
    {
      title: locale === "ar" ? "مركز المساعدة" : "Help Center",
      url: `${p}/dashboard/help-center`,
      icon: IconHelp,
    },
    {
      title: locale === "ar" ? "الدعم الفني" : "Support",
      url: `${p}/dashboard/support`,
      icon: IconMessageCircle,
    },
    {
      title: locale === "ar" ? "إعدادات النظام" : "Settings",
      url: `${p}/dashboard/settings`,
      icon: IconUsers,
    },
  ];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const p = locale === "en" ? "/en" : "";
  const [role, setRole] = React.useState<string | undefined>(undefined);
  const [hasTenant, setHasTenant] = React.useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const tenant = getCookieValue("ujoors_tenant");
      if (mounted) setHasTenant(Boolean(tenant));
      const session = await getSession();
      if (mounted) setRole((session?.user as any)?.role);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const navItems = React.useMemo(() => getNav(locale, role, hasTenant), [locale, role, hasTenant]);
  const homeUrl = role === "SUPER_ADMIN" && !hasTenant ? `${p}/dashboard/super-admin` : `${p}/dashboard`;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={homeUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-sm font-bold">U</span>
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Ujoors (أجور)</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
    </Sidebar>
  )
}
