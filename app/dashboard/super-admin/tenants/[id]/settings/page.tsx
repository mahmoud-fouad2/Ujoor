/**
 * Tenant Settings Page
 * صفحة إعدادات الشركة
 */

"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight, Building2, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tenant } from "@/lib/types/tenant";
import { TenantSettingsForm } from "./tenant-settings-form";
import { tenantsService } from "@/lib/api";
import { TenantAdminCredentialsCard } from "./tenant-admin-credentials-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TenantSettingsPage({ params }: PageProps) {
  const [id, setId] = React.useState<string | null>(null);
  const [tenant, setTenant] = React.useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Resolve params Promise
  React.useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  React.useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await tenantsService.getById(id);
        if (!mounted) return;
        if (res.success && res.data) {
          setTenant(res.data);
        } else {
          setTenant(null);
          setError(res.error || "تعذر تحميل بيانات الشركة");
        }
      } catch (e) {
        if (!mounted) return;
        setTenant(null);
        setError(e instanceof Error ? e.message : "تعذر تحميل بيانات الشركة");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!id || isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        جاري تحميل إعدادات الشركة...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          {error}
        </div>
        <Link href="/dashboard/super-admin/tenants" className="text-sm text-primary hover:underline">
          العودة إلى قائمة الشركات
        </Link>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">الشركة غير موجودة.</p>
        <Link href="/dashboard/super-admin/tenants" className="text-sm text-primary hover:underline">
          العودة إلى قائمة الشركات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/dashboard/super-admin/tenants" className="hover:text-primary">
            الشركات
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <Link href={`/dashboard/super-admin/tenants/${id}`} className="hover:text-primary">
            {tenant.nameAr}
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>الإعدادات</span>
        </div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          إعدادات الشركة
        </h1>
        <p className="text-muted-foreground">{tenant.nameAr} - {tenant.name}</p>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة</CardTitle>
          <CardDescription>
            تعديل إعدادات الشركة والباقة واللغة والثيم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantSettingsForm tenant={tenant} />
        </CardContent>
      </Card>

      <TenantAdminCredentialsCard tenantId={tenant.id} />

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
          <CardDescription>
            إجراءات حساسة - تستخدم بحذر
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <div>
              <p className="font-medium">إيقاف الشركة</p>
              <p className="text-sm text-muted-foreground">
                إيقاف الشركة مؤقتًا - لن يتمكن المستخدمون من الوصول
              </p>
            </div>
            <button className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
              إيقاف
            </button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <p className="font-medium text-destructive">حذف الشركة</p>
              <p className="text-sm text-muted-foreground">
                حذف الشركة نهائيًا - لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>
            <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
              حذف
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
