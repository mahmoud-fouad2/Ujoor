"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  loadMobileAuth,
  mobileAuthFetch,
  mobileChallenge,
  mobileLogoutAll,
} from "@/lib/mobile/web-client";

type TodayStatus = {
  data: {
    date: string;
    status: "NONE" | "CHECKED_IN" | "CHECKED_OUT";
    canCheckIn: boolean;
    canCheckOut: boolean;
    record: any;
  };
};

export default function MobileHomePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<TodayStatus | null>(null);

  const auth = useMemo(() => loadMobileAuth(), []);

  async function load() {
    setError(null);
    try {
      const res = await mobileAuthFetch<TodayStatus>("/api/mobile/attendance/today");
      setToday(res);
    } catch (e: any) {
      setError(e?.message || "فشل تحميل الحالة");
    }
  }

  useEffect(() => {
    if (!auth?.accessToken) {
      router.replace("/m/login");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function submit(type: "check-in" | "check-out") {
    setBusy(true);
    setError(null);
    try {
      const nonce = await mobileChallenge();
      await mobileAuthFetch("/api/mobile/attendance", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-mobile-challenge": nonce,
        },
        body: JSON.stringify({ type }),
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "فشل تسجيل البصمة");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await mobileLogoutAll();
      router.replace("/m/login");
    } finally {
      setBusy(false);
    }
  }

  const status = today?.data?.status;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">البصمة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            {auth?.user?.tenant?.nameAr || auth?.user?.tenant?.name || ""}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={busy || !today?.data?.canCheckIn}
              onClick={() => void submit("check-in")}
            >
              بصمة دخول
            </Button>
            <Button
              variant="secondary"
              disabled={busy || !today?.data?.canCheckOut}
              onClick={() => void submit("check-out")}
            >
              بصمة خروج
            </Button>
          </div>

          <Separator />

          <div className="text-center text-sm">
            الحالة اليوم: <span className="font-medium">{status || "..."}</span>
          </div>

          {error ? <p className="text-sm text-destructive text-center">{error}</p> : null}

          <div className="flex items-center justify-between pt-1">
            <Button asChild variant="link" className="px-0">
              <Link href="/m/settings">الإعدادات</Link>
            </Button>
            <Button onClick={() => void logout()} variant="ghost" disabled={busy}>
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        هذا وضع الجوال: دخول/خروج + إعدادات بسيطة فقط.
      </p>
    </div>
  );
}
