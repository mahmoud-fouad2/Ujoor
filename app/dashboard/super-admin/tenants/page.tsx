/**
 * Tenants List Page
 * شاشة قائمة الشركات
 */

import { Suspense } from "react";
import Link from "next/link";
import { Building2, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TenantsTable } from "./tenants-table";

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            إدارة الشركات
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع الشركات المسجلة في المنصة
          </p>
        </div>
        <Link href="/dashboard/super-admin/tenants/new">
          <Button>
            <Plus className="h-4 w-4 me-2" />
            إنشاء شركة جديدة
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو الـ slug..."
                className="ps-9"
                aria-label="البحث بالاسم أو الـ slug"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label="تصفية حسب الحالة"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="pending">معلق</option>
                <option value="suspended">موقوف</option>
              </select>
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label="تصفية حسب الباقة"
              >
                <option value="">جميع الباقات</option>
                <option value="starter">Starter</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
            <TenantsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
