"use client"

import * as React from "react"
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

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function getLocale(): "ar" | "en" {
  if (typeof document === "undefined") return "ar";
  return document.documentElement.lang === "en" ? "en" : "ar";
}

function getNav(locale: "ar" | "en") {
  const p = locale === "en" ? "/en" : "";
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
  const locale = getLocale();
  const p = locale === "en" ? "/en" : "";

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
              <Link href={`${p}/dashboard`}>
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
        <NavMain items={getNav(locale)} />
      </SidebarContent>
    </Sidebar>
  )
}
