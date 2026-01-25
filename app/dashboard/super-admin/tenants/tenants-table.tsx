"use client";

/**
 * Tenants Data Table
 * جدول الشركات مع الإجراءات
 */

import Link from "next/link";
import * as React from "react";
import { 
  MoreHorizontal, 
  Eye, 
  Settings, 
  Pause, 
  Play, 
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tenant, TenantStatus } from "@/lib/types/tenant";
import { buildTenantUrl } from "@/lib/tenant";
import { tenantsService } from "@/lib/api";

const statusConfig: Record<TenantStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  active: { 
    label: "نشط", 
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  pending: { 
    label: "معلق", 
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />
  },
  suspended: { 
    label: "موقوف", 
    variant: "destructive",
    icon: <AlertCircle className="h-3 w-3" />
  },
  deleted: { 
    label: "محذوف", 
    variant: "outline",
    icon: <XCircle className="h-3 w-3" />
  },
};

const planLabels: Record<string, string> = {
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

export function TenantsTable() {
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await tenantsService.getAll();
        if (!mounted) return;
        if (res.success && res.data) {
          setTenants(res.data);
        } else {
          setTenants([]);
          setError(res.error || "فشل تحميل الشركات");
        }
      } catch (e) {
        if (!mounted) return;
        setTenants([]);
        setError(e instanceof Error ? e.message : "فشل تحميل الشركات");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        جاري تحميل الشركات...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
        <p className="font-medium">تعذر تحميل الشركات</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">لا توجد شركات</h3>
        <p className="text-muted-foreground">لم يتم العثور على أي شركات لعرضها</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الشركة</TableHead>
          <TableHead>الـ Slug</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>الباقة</TableHead>
          <TableHead className="text-center">المستخدمين</TableHead>
          <TableHead className="text-center">الموظفين</TableHead>
          <TableHead>تاريخ الإنشاء</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>
              <div>
                <Link 
                  href={`/dashboard/super-admin/tenants/${tenant.id}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {tenant.nameAr}
                </Link>
                <p className="text-sm text-muted-foreground">{tenant.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <code className="rounded bg-muted px-2 py-1 text-sm">
                {tenant.slug}
              </code>
            </TableCell>
            <TableCell>
              <Badge variant={statusConfig[tenant.status].variant} className="gap-1">
                {statusConfig[tenant.status].icon}
                {statusConfig[tenant.status].label}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{planLabels[tenant.plan]}</Badge>
            </TableCell>
            <TableCell className="text-center">{tenant.usersCount}</TableCell>
            <TableCell className="text-center">{tenant.employeesCount}</TableCell>
            <TableCell>
              {new Date(tenant.createdAt).toLocaleDateString("ar-SA")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/super-admin/tenants/${tenant.id}`}>
                      <Eye className="me-2 h-4 w-4" />
                      عرض التفاصيل
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/super-admin/tenants/${tenant.id}/settings`}>
                      <Settings className="me-2 h-4 w-4" />
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={buildTenantUrl(tenant.slug, "/dashboard")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="me-2 h-4 w-4" />
                      فتح لوحة الشركة
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {tenant.status === "active" ? (
                    <DropdownMenuItem className="text-amber-600">
                      <Pause className="me-2 h-4 w-4" />
                      إيقاف الشركة
                    </DropdownMenuItem>
                  ) : tenant.status === "suspended" ? (
                    <DropdownMenuItem className="text-green-600">
                      <Play className="me-2 h-4 w-4" />
                      تفعيل الشركة
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="me-2 h-4 w-4" />
                    حذف الشركة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
