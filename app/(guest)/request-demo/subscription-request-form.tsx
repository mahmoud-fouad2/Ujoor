"use client";

/**
 * Subscription Request Form
 * نموذج طلب الاشتراك
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const requestSchema = z.object({
  companyName: z.string().min(2, "اسم الشركة مطلوب"),
  companyNameAr: z.string().optional(),
  contactName: z.string().min(2, "اسم المسؤول مطلوب"),
  contactEmail: z.string().email("البريد الإلكتروني غير صحيح"),
  contactPhone: z.string().optional(),
  employeesCount: z.string().min(1, "اختر عدد الموظفين"),
  message: z.string().optional(),
});

type RequestInput = z.infer<typeof requestSchema>;

export function SubscriptionRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestInput) => {
    setIsLoading(true);

    // TODO: Call API to submit request
    console.log("Submitting request:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">تم استلام طلبك بنجاح!</h3>
        <p className="mb-6 text-muted-foreground">
          شكرًا لاهتمامك بمنصة أجور. سيتواصل معك فريقنا خلال 24 ساعة.
        </p>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">اسم الشركة (بالإنجليزية) *</Label>
          <Input
            id="companyName"
            placeholder="Company Name"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-sm text-destructive">{errors.companyName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyNameAr">اسم الشركة (بالعربية)</Label>
          <Input
            id="companyNameAr"
            placeholder="اسم الشركة"
            {...register("companyNameAr")}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactName">اسم المسؤول *</Label>
          <Input
            id="contactName"
            placeholder="أحمد محمد"
            {...register("contactName")}
          />
          {errors.contactName && (
            <p className="text-sm text-destructive">{errors.contactName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">البريد الإلكتروني *</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="email@company.sa"
            {...register("contactEmail")}
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">رقم الهاتف</Label>
          <Input
            id="contactPhone"
            placeholder="+966501234567"
            {...register("contactPhone")}
          />
        </div>
        
        <div className="space-y-2">
          <Label>عدد الموظفين *</Label>
          <Select onValueChange={(value) => setValue("employeesCount", value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1 - 10 موظفين</SelectItem>
              <SelectItem value="11-50">11 - 50 موظف</SelectItem>
              <SelectItem value="51-200">51 - 200 موظف</SelectItem>
              <SelectItem value="200+">أكثر من 200 موظف</SelectItem>
            </SelectContent>
          </Select>
          {errors.employeesCount && (
            <p className="text-sm text-destructive">{errors.employeesCount.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">رسالة أو ملاحظات</Label>
        <Textarea
          id="message"
          placeholder="أخبرنا المزيد عن احتياجاتك..."
          rows={4}
          {...register("message")}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        إرسال الطلب
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        بإرسال هذا النموذج، أنت توافق على{" "}
        <a href="#" className="text-primary hover:underline">
          سياسة الخصوصية
        </a>{" "}
        و{" "}
        <a href="#" className="text-primary hover:underline">
          شروط الاستخدام
        </a>
      </p>
    </form>
  );
}
