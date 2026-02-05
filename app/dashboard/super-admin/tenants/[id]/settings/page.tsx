/**
 * Tenant Settings Page
 * صفحة إعدادات الشركة
 */

"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight, Settings, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Tenant } from "@/lib/types/tenant";
import { TenantSettingsForm } from "./tenant-settings-form";
import { tenantsService } from "@/lib/api";
import { TenantAdminCredentialsCard } from "./tenant-admin-credentials-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Delete Tenant Dialog Component with controlled open state
function DeleteTenantDialog({
  tenant,
  busyAction,
  onDelete,
}: {
  tenant: Tenant;
  busyAction: string | null;
  onDelete: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete();
      // Don't close - the redirect will happen
    } catch {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <div>
        <p className="font-medium text-destructive">حذف الشركة</p>
        <p className="text-sm text-muted-foreground">
          حذف الشركة نهائيًا - لا يمكن التراجع عن هذا الإجراء
        </p>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={busyAction !== null || deleting}>
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الحذف...
              </>
            ) : (
              "حذف"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الشركة</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم إلغاء الشركة "{tenant.nameAr}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جارٍ الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TenantSettingsPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);
  const [tenant, setTenant] = React.useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busyAction, setBusyAction] = React.useState<null | "suspend" | "activate" | "delete">(null);
  const [suspendReason, setSuspendReason] = React.useState("");

  // Resolve params Promise
  React.useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const loadTenant = React.useCallback(async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await tenantsService.getById(tenantId);
      if (res.success && res.data) {
        setTenant(res.data);
      } else {
        setTenant(null);
        setError(res.error || "تعذر تحميل بيانات الشركة");
      }
    } catch (e) {
      setTenant(null);
      setError(e instanceof Error ? e.message : "تعذر تحميل بيانات الشركة");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!id) return;
    void loadTenant(id);
  }, [id, loadTenant]);

  async function doSuspend() {
    if (!tenant) return;
    setBusyAction("suspend");
    try {
      const res = await tenantsService.suspend(tenant.id, suspendReason.trim() || "Suspended by admin");
      if (!res.success) {
        toast.error(res.error || "تعذر إيقاف الشركة");
        return;
      }
      toast.success("تم إيقاف الشركة");
      await loadTenant(tenant.id);
    } finally {
      setBusyAction(null);
    }
  }

  async function doActivate() {
    if (!tenant) return;
    setBusyAction("activate");
    try {
      const res = await tenantsService.activate(tenant.id);
      if (!res.success) {
        toast.error(res.error || "تعذر تفعيل الشركة");
        return;
      }
      toast.success("تم تفعيل الشركة");
      await loadTenant(tenant.id);
    } finally {
      setBusyAction(null);
    }
  }

  async function doDelete() {
    if (!tenant) return;
    setBusyAction("delete");
    try {
      const res = await tenantsService.delete(tenant.id);
      if (!res.success) {
        toast.error(res.error || "تعذر حذف الشركة");
        return;
      }
      toast.success("تم حذف الشركة");
      router.push("/dashboard/super-admin/tenants");
    } finally {
      setBusyAction(null);
    }
  }

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

  const isSuspended = tenant.status === "suspended";

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
          <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <div>
              <p className="font-medium">{isSuspended ? "تفعيل الشركة" : "إيقاف الشركة"}</p>
              <p className="text-sm text-muted-foreground">
                {isSuspended
                  ? "إعادة تفعيل الشركة - سيتمكن المستخدمون من الوصول"
                  : "إيقاف الشركة مؤقتًا - لن يتمكن المستخدمون من الوصول"}
              </p>
            </div>

            {isSuspended ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={busyAction !== null} className="bg-emerald-600 hover:bg-emerald-700">
                    تفعيل
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد تفعيل الشركة</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم تفعيل الشركة وإعادة السماح بالدخول للمستخدمين.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void doActivate()} disabled={busyAction !== null}>
                      تأكيد
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={busyAction !== null} className="bg-amber-600 hover:bg-amber-700">
                    إيقاف
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد إيقاف الشركة</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم منع المستخدمين من الدخول حتى يتم تفعيل الشركة مرة أخرى.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">سبب الإيقاف (اختياري)</label>
                    <Input value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} placeholder="مثال: فواتير متأخرة" />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void doSuspend()} disabled={busyAction !== null}>
                      تأكيد
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <DeleteTenantDialog 
            tenant={tenant} 
            busyAction={busyAction} 
            onDelete={doDelete} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
