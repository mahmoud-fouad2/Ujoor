"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MobileHeader from "@/components/mobile/mobile-header";
import { formatArabicDate, formatTimeHHMM, getCurrentPositionSafe, greeting } from "@/components/mobile/mobile-utils";
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
  const [now, setNow] = useState(() => new Date());

  const auth = useMemo(() => loadMobileAuth(), []);
  const displayName =
    ((auth?.user?.firstName || "") + (auth?.user?.lastName ? ` ${auth.user.lastName}` : "")).trim() ||
    auth?.user?.email ||
    "";
  const tenantName = auth?.user?.tenant?.nameAr || auth?.user?.tenant?.name || "";
  const dateText = formatArabicDate(now, "ar");

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
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function submit(type: "check-in" | "check-out") {
    setBusy(true);
    setError(null);
    try {
      const nonce = await mobileChallenge();

      const pos = await getCurrentPositionSafe({ timeoutMs: 9000, highAccuracy: true });
      await mobileAuthFetch("/api/mobile/attendance", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-mobile-challenge": nonce,
        },
        body: JSON.stringify({
          type,
          latitude: pos?.latitude,
          longitude: pos?.longitude,
          accuracy: pos?.accuracy,
        }),
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
  const checkInTime = today?.data?.record?.checkInTime ? new Date(today.data.record.checkInTime) : null;
  const checkOutTime = today?.data?.record?.checkOutTime ? new Date(today.data.record.checkOutTime) : null;
  const timeNow = formatTimeHHMM(now, "ar");

  return (
    <div className="space-y-4" dir="rtl">
      <MobileHeader dateText={dateText} />

      <div className="space-y-1">
        <div className="text-sm text-muted-foreground text-start">{greeting("ar", now)}</div>
        <div className="text-2xl font-semibold text-start truncate">{displayName}</div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex size-9 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm/5 text-white/80 truncate">{tenantName}</div>
                <div className="text-base font-medium truncate">الحضور</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="truncate">Riyadh</span>
              <MapPin className="size-4" />
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="text-5xl font-semibold tabular-nums tracking-tight">{timeNow}</div>
            <div className="text-sm text-white/70">
              {checkInTime ? (
                <div className="text-start">دخول: {formatTimeHHMM(checkInTime, "ar")}</div>
              ) : (
                <div className="text-start">دخول: -</div>
              )}
              {checkOutTime ? (
                <div className="text-start">خروج: {formatTimeHHMM(checkOutTime, "ar")}</div>
              ) : (
                <div className="text-start">خروج: -</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button
              className="w-full bg-white/15 text-white hover:bg-white/20"
              variant="secondary"
              disabled={busy || (!today?.data?.canCheckIn && !today?.data?.canCheckOut)}
              onClick={() => void submit(today?.data?.canCheckOut ? "check-out" : "check-in")}
            >
              {today?.data?.canCheckOut
                ? "تسجيل الانصراف"
                : "تسجيل الحضور"}
            </Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button disabled={busy || !today?.data?.canCheckIn} onClick={() => void submit("check-in")}>
                بصمة دخول
              </Button>
              <Button variant="secondary" disabled={busy || !today?.data?.canCheckOut} onClick={() => void submit("check-out")}>
                بصمة خروج
              </Button>
            </div>
          </div>

          <div className="mt-3 text-center text-sm text-white/80">
            الحالة اليوم: <span className="font-medium">{status || "..."}</span>
          </div>

          {error ? <p className="mt-2 text-sm text-red-200 text-center">{error}</p> : null}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Link href="/m/attendance" className="rounded-xl border bg-background p-3 text-start shadow-sm">
          <div className="text-sm font-medium">سجل الحضور</div>
          <div className="text-xs text-muted-foreground mt-1">عرض آخر الأيام</div>
        </Link>
        <Link href="/m/requests" className="rounded-xl border bg-background p-3 text-start shadow-sm">
          <div className="text-sm font-medium">طلباتك</div>
          <div className="text-xs text-muted-foreground mt-1">تذاكر + طلبات</div>
        </Link>
        <Link href="/m/settings" className="rounded-xl border bg-background p-3 text-start shadow-sm">
          <div className="text-sm font-medium">الإعدادات</div>
          <div className="text-xs text-muted-foreground mt-1">ملفك</div>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="py-4">
          <CardTitle className="text-start text-base">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/m/requests?new=ticket">طلب جديد</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/m/requests">عرض الطلبات</Link>
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-between">
        <Button asChild variant="link" className="px-0">
          <Link href="/m/settings">الإعدادات</Link>
        </Button>
        <Button onClick={() => void logout()} variant="ghost" disabled={busy}>
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}
