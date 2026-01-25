"use client";

/**
 * Tenant Settings Form
 * نموذج إعدادات الشركة
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Tenant } from "@/lib/types/tenant";

interface TenantSettingsFormProps {
  tenant: Tenant;
}

export function TenantSettingsForm({ tenant }: TenantSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tenant.name,
    nameAr: tenant.nameAr,
    email: tenant.email,
    phone: tenant.phone || "",
    plan: tenant.plan,
    defaultLocale: tenant.defaultLocale,
    defaultTheme: tenant.defaultTheme,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Call API to update tenant
    console.log("Updating tenant:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">معلومات الشركة</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nameAr">اسم الشركة بالعربية</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">اسم الشركة بالإنجليزية</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">الإعدادات</h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>الباقة</Label>
            <Select
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>اللغة الافتراضية</Label>
            <Select
              value={formData.defaultLocale}
              onValueChange={(value) => setFormData({ ...formData, defaultLocale: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>الثيم الافتراضي</Label>
            <Select
              value={formData.defaultTheme}
              onValueChange={(value) => setFormData({ ...formData, defaultTheme: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shadcn">Modern (shadcn)</SelectItem>
                <SelectItem value="mantine">Classic (Mantine)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
