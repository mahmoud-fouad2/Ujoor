"use client";

/**
 * Subscription Request Form
 * نموذج طلب الاشتراك
 */

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
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
import { t } from "@/lib/i18n/messages";

function getLocaleFromCookie(): "ar" | "en" {
  if (typeof document === "undefined") return "ar";
  const match = document.cookie.match(/(?:^|; )ujoors_locale=([^;]+)/);
  return match?.[1] === "en" ? "en" : "ar";
}

function createRequestSchema(isAr: boolean) {
  const phoneRegex = /^\+?\d{8,15}$/;
  return z.object({
    companyName: z.string().min(2, isAr ? "اسم الشركة مطلوب" : "Company name is required"),
    companyNameAr: z.string().optional(),
    contactName: z.string().min(2, isAr ? "اسم المسؤول مطلوب" : "Contact name is required"),
    contactEmail: z.string().email(isAr ? "البريد الإلكتروني غير صحيح" : "Invalid email address"),
    contactPhone: z
      .string()
      .optional()
      .refine((v) => !v || phoneRegex.test(v), isAr ? "رقم الهاتف غير صحيح" : "Invalid phone number"),
    employeesCount: z.string().min(1, isAr ? "اختر عدد الموظفين" : "Select employee count"),
    message: z
      .string()
      .optional()
      .refine((v) => !v || v.length <= 2000, isAr ? "الرسالة طويلة جدًا" : "Message is too long"),
  });
}

type RequestInput = z.infer<ReturnType<typeof createRequestSchema>>;

export function SubscriptionRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locale] = useState<"ar" | "en">(() => getLocaleFromCookie());
  const isAr = locale === "ar";
  const prefix = locale === "en" ? "/en" : "";

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const requestSchema = useMemo(() => createRequestSchema(isAr), [isAr]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestInput) => {
    setSubmitError(null);

    if (!siteKey) {
      setSubmitError(t(locale, "captcha.missingConfig"));
      return;
    }

    if (!captchaToken) {
      setSubmitError(t(locale, "captcha.required"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/public/tenant-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          captchaToken,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || (isAr ? "تعذر إرسال الطلب" : "Failed to submit request"));
      }

      setIsSuccess(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : isAr ? "تعذر إرسال الطلب" : "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">
          {isAr ? "تم استلام طلبك بنجاح!" : "Request received successfully!"}
        </h3>
        <p className="mb-6 text-muted-foreground">
          {isAr
            ? "شكرًا لاهتمامك بمنصة أجور. سيتواصل معك فريقنا خلال 24 ساعة."
            : "Thanks for your interest in Ujoors. Our team will contact you within 24 hours."}
        </p>
        <Button variant="outline" onClick={() => (window.location.href = prefix || "/") }>
          {isAr ? "العودة للرئيسية" : "Back to home"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">{isAr ? "اسم الشركة (بالإنجليزية) *" : "Company name (English) *"}</Label>
          <Input
            id="companyName"
            placeholder={isAr ? "Company Name" : "Company Name"}
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-sm text-destructive">{errors.companyName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyNameAr">{isAr ? "اسم الشركة (بالعربية)" : "Company name (Arabic)"}</Label>
          <Input
            id="companyNameAr"
            placeholder={isAr ? "اسم الشركة" : "اسم الشركة"}
            {...register("companyNameAr")}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactName">{isAr ? "اسم المسؤول *" : "Contact name *"}</Label>
          <Input
            id="contactName"
            placeholder={isAr ? "أحمد محمد" : "John Smith"}
            {...register("contactName")}
          />
          {errors.contactName && (
            <p className="text-sm text-destructive">{errors.contactName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">{isAr ? "البريد الإلكتروني *" : "Email *"}</Label>
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
          <Label htmlFor="contactPhone">{isAr ? "رقم الهاتف" : "Phone"}</Label>
          <Input
            id="contactPhone"
            placeholder="+966501234567"
            {...register("contactPhone")}
          />
        </div>
        
        <div className="space-y-2">
          <Label>{isAr ? "عدد الموظفين *" : "Employee count *"}</Label>
          <Select onValueChange={(value) => setValue("employeesCount", value)}>
            <SelectTrigger>
              <SelectValue placeholder={isAr ? "اختر" : "Select"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">{isAr ? "1 - 10 موظفين" : "1 - 10 employees"}</SelectItem>
              <SelectItem value="11-50">{isAr ? "11 - 50 موظف" : "11 - 50 employees"}</SelectItem>
              <SelectItem value="51-200">{isAr ? "51 - 200 موظف" : "51 - 200 employees"}</SelectItem>
              <SelectItem value="200+">{isAr ? "أكثر من 200 موظف" : "200+ employees"}</SelectItem>
            </SelectContent>
          </Select>
          {errors.employeesCount && (
            <p className="text-sm text-destructive">{errors.employeesCount.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">{isAr ? "رسالة أو ملاحظات" : "Message / notes"}</Label>
        <Textarea
          id="message"
          placeholder={isAr ? "أخبرنا المزيد عن احتياجاتك..." : "Tell us about your needs..."}
          rows={4}
          {...register("message")}
        />
      </div>

      <div className="space-y-2">
        <Label>{isAr ? "التحقق" : "Verification"}</Label>
        {siteKey ? (
          <div className="flex justify-center sm:justify-start">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={(token: string | null) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>
        ) : (
          <p className="text-sm text-destructive">{t(locale, "captcha.missingConfig")}</p>
        )}
      </div>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {isLoading ? t(locale, "form.submitting") : t(locale, "form.submit")}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {t(locale, "form.agreePrefix")}
        <a href={`${prefix}/privacy`} className="text-primary hover:underline">
          {t(locale, "form.privacyPolicy")}
        </a>{" "}
        {t(locale, "form.and")}
        <a href={`${prefix}/terms`} className="text-primary hover:underline">
          {t(locale, "form.terms")}
        </a>
      </p>
    </form>
  );
}
