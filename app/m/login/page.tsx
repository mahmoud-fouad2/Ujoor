"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mobileLogin } from "@/lib/mobile/web-client";

export default function MobileLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => email.trim() && password, [email, password]);

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
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-center">تسجيل الدخول</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={busy}
              dir="ltr"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" disabled={!canSubmit || busy} type="submit">
            {busy ? "جاري الدخول..." : "دخول"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            هذا مدخل الجوال (بصمة فقط) ولا يحتاج اختيار الشركة.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
