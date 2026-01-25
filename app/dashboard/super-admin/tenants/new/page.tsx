/**
 * Create Tenant Wizard Page
 * معالج إنشاء شركة جديدة
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CreateTenantForm } from "./create-tenant-form";

export default function CreateTenantPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          إنشاء شركة جديدة
        </h1>
        <p className="text-muted-foreground">
          أدخل بيانات الشركة لإنشاء حساب جديد على المنصة
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الشركة</CardTitle>
          <CardDescription>
            جميع الحقول المطلوبة معلمة بـ *
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTenantForm />
        </CardContent>
      </Card>
    </div>
  );
}
