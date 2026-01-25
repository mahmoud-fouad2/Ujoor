/**
 * Subscription Requests Page (Inbox)
 * صفحة طلبات الاشتراك
 */

import { Suspense } from "react";
import { Inbox, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RequestsTable } from "./requests-table";

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Inbox className="h-6 w-6" />
          طلبات الاشتراك
        </h1>
        <p className="text-muted-foreground">
          إدارة طلبات الاشتراك الواردة من الشركات
        </p>
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
                placeholder="البحث باسم الشركة أو البريد الإلكتروني..."
                className="ps-9"
              />
            </div>
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">جميع الحالات</option>
              <option value="pending">معلقة</option>
              <option value="approved">مقبولة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
            <RequestsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
