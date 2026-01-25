"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
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

const data = {
  navMain: [
    {
      title: "الرئيسية",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "طلبات الاشتراك (Super Admin)",
      url: "/dashboard/super-admin/requests",
      icon: IconListDetails,
    },
    {
      title: "الشركات (Super Admin)",
      url: "/dashboard/super-admin/tenants",
      icon: IconUsers,
    },
    {
      title: "الموظفون",
      url: "/dashboard/employees",
      icon: IconChartBar,
    },
    {
      title: "الأقسام",
      url: "/dashboard/departments",
      icon: IconFolder,
    },
    {
      title: "المسميات الوظيفية",
      url: "/dashboard/job-titles",
      icon: IconFolder,
    },
    {
      title: "الهيكل التنظيمي",
      url: "/dashboard/organization",
      icon: IconFolder,
    },
    {
      title: "المستخدمون",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "إعدادات النظام",
      url: "/dashboard/settings",
      icon: IconUsers,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <Link href="/dashboard">
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
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
