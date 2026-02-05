import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";
import prisma from "@/lib/db";
import { requireRole, type UserRole } from "@/lib/auth";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import UsersDataTable from "./data-table";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata>{
  const locale = await getAppLocale();
  return generateMeta({
    title: locale === "ar" ? "المستخدمون" : "Users",
    description:
      locale === "ar"
        ? "قائمة المستخدمين وإدارتهم."
        : "Users list and management.",
  });
}

export default async function Page() {
  const locale = await getAppLocale();
  const t = getText(locale);

  const user = await requireRole(["TENANT_ADMIN", "HR_MANAGER", "SUPER_ADMIN"] as UserRole[]);

  // Super Admin without tenant context should go to super-admin dashboard
  if (!user.tenantId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "لا توجد شركة محددة" : "No tenant selected"}
        </h1>
        <p className="text-muted-foreground max-w-md">
          {locale === "ar"
            ? "أنت مسجل دخول كـ Super Admin. لعرض المستخدمين، يرجى اختيار شركة أولاً من لوحة تحكم السوبر أدمن."
            : "You are logged in as Super Admin. To view users, please select a tenant first from the Super Admin dashboard."}
        </p>
        <Button asChild>
          <Link href="/dashboard/super-admin/tenants">
            {locale === "ar" ? "الذهاب إلى الشركات" : "Go to Tenants"}
          </Link>
        </Button>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      status: true,
      email: true,
      lastLoginAt: true,
    },
  });

  const tableData = users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`.trim(),
    image: u.avatar,
    role: u.role,
    status: u.status,
    email: u.email,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
  }));

  return (
    <>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">{locale === "ar" ? "المستخدمون" : "Users"}</h1>
        <Button asChild>
          <Link href="/dashboard/users/add">
            <PlusCircledIcon className="me-2" /> {locale === "ar" ? "إضافة مستخدم" : "Add user"}
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <UsersDataTable data={tableData} />
        </CardContent>
      </Card>
    </>
  );
}
