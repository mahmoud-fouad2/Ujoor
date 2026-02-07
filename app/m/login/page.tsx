"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mobileLogin } from "@/lib/mobile/web-client";

export default function MobileLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 3 && password.length > 0, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const auth = await mobileLogin(email.trim(), password);
      if (!auth.user.employeeId) {
        setError("هذا الحساب ليس موظفاً. يرجى تسجيل الدخول بحساب موظف.");
        return;
      }
      if (!auth.user.tenantId) {
        setError("لا يمكن استخدام هذا الحساب على الجوال بدون شركة.");
        return;
      }
      router.replace("/m/home");
    } catch (err: any) {
      setError(err?.message || "فشل تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[85dvh] flex-col items-center justify-center" dir="rtl">
      {/* Brand */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex size-[72px] items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
          <Fingerprint className="size-9 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Ujoor</h1>
          <p className="mt-0.5 text-[13px] text-slate-400">نظام إدارة الموارد البشرية</p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full rounded-3xl bg-white p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]">
        <h2 className="mb-6 text-center text-lg font-semibold text-slate-800">تسجيل الدخول</h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-slate-600">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              disabled={busy}
              dir="ltr"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-300 focus:border-primary focus:bg-white focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] font-medium text-slate-600">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={busy}
              dir="ltr"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-300 focus:border-primary focus:bg-white focus:ring-primary/20"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-600">
              {error}
            </div>
          )}

          <Button
            className="h-12 w-full rounded-xl text-[15px] font-semibold shadow-sm shadow-primary/20"
            disabled={!canSubmit || busy}
            type="submit"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                جاري الدخول...
              </span>
            ) : (
              "دخول"
            )}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-300">
        Ujoor © {new Date().getFullYear()}
      </p>
    </div>
  );
}
