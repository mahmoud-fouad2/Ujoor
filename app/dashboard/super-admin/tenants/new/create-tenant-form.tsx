"use client";

/**
 * Create Tenant Form
 * نموذج إنشاء شركة جديدة
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Building2, User, Settings } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

// Validation Schema
const createTenantSchema = z.object({
  // Company Info
  name: z.string().min(2, "اسم الشركة بالإنجليزية مطلوب"),
  nameAr: z.string().min(2, "اسم الشركة بالعربية مطلوب"),
  slug: z
    .string()
    .min(3, "الـ slug يجب أن يكون 3 أحرف على الأقل")
    .max(30, "الـ slug يجب أن يكون أقل من 30 حرف")
    .regex(/^[a-z0-9-]+$/, "الـ slug يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  commercialRegister: z.string().optional(),
  
  // Settings
  plan: z.enum(["starter", "business", "enterprise"]),
  defaultLocale: z.enum(["ar", "en"]),
  defaultTheme: z.enum(["shadcn", "mantine"]),
  
  // Company Admin
  adminName: z.string().min(2, "اسم المدير مطلوب"),
  adminEmail: z.string().email("البريد الإلكتروني للمدير غير صحيح"),
  sendInvite: z.boolean().default(true),
});

type CreateTenantInput = z.infer<typeof createTenantSchema>;

export function CreateTenantForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      plan: "business",
      defaultLocale: "ar",
      defaultTheme: "shadcn",
      sendInvite: true,
    },
  });

  // Auto-generate slug from English name
  const name = watch("name");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    register("name").onChange(e);
    // Auto-generate slug
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 30);
    setValue("slug", slug);
  };

  const onSubmit = async (data: CreateTenantInput) => {
    setIsLoading(true);
    
    // TODO: Call API to create tenant
    console.log("Creating tenant:", data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Redirect to tenants list
    router.push("/dashboard/super-admin/tenants?created=true");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1: Company Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Building2 className="h-5 w-5" />
          معلومات الشركة
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nameAr">اسم الشركة بالعربية *</Label>
            <Input
              id="nameAr"
              placeholder="شركة النخبة للتقنية"
              {...register("nameAr")}
            />
            {errors.nameAr && (
              <p className="text-sm text-destructive">{errors.nameAr.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">اسم الشركة بالإنجليزية *</Label>
            <Input
              id="name"
              placeholder="Elite Technology Co."
              {...register("name")}
              onChange={handleNameChange}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">الـ Subdomain (slug) *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="slug"
                placeholder="elite-tech"
                className="flex-1"
                {...register("slug")}
              />
              <span className="text-sm text-muted-foreground">.ujoors.com</span>
            </div>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commercialRegister">السجل التجاري</Label>
            <Input
              id="commercialRegister"
              placeholder="1010123456"
              {...register("commercialRegister")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني للشركة *</Label>
            <Input
              id="email"
              type="email"
              placeholder="info@company.sa"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              placeholder="+966501234567"
              {...register("phone")}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Settings className="h-5 w-5" />
          الإعدادات الافتراضية
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>الباقة *</Label>
            <Select
              defaultValue="business"
              onValueChange={(value) => setValue("plan", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الباقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>اللغة الافتراضية *</Label>
            <Select
              defaultValue="ar"
              onValueChange={(value) => setValue("defaultLocale", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>الثيم الافتراضي *</Label>
            <Select
              defaultValue="shadcn"
              onValueChange={(value) => setValue("defaultTheme", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الثيم" />
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

      {/* Section 3: Company Admin */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          مدير الشركة (Company Admin)
        </div>
        <p className="text-sm text-muted-foreground">
          سيتم إرسال دعوة لهذا المستخدم ليكون المدير الرئيسي للشركة
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adminName">اسم المدير *</Label>
            <Input
              id="adminName"
              placeholder="أحمد محمد"
              {...register("adminName")}
            />
            {errors.adminName && (
              <p className="text-sm text-destructive">{errors.adminName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminEmail">البريد الإلكتروني للمدير *</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@company.sa"
              {...register("adminEmail")}
            />
            {errors.adminEmail && (
              <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="sendInvite"
            defaultChecked
            onCheckedChange={(checked) => setValue("sendInvite", !!checked)}
          />
          <Label htmlFor="sendInvite" className="text-sm font-normal">
            إرسال دعوة بالبريد الإلكتروني للمدير
          </Label>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          إنشاء الشركة
        </Button>
      </div>
    </form>
  );
}
