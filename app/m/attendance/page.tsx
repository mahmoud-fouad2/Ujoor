"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { loadMobileAuth, mobileAuthFetch } from "@/lib/mobile/web-client";
import { formatArabicDate, formatTimeHHMM } from "@/components/mobile/mobile-utils";

type AttendanceListResponse = {
  data: {
    items: Array<any>;
    page: number;
    limit: number;
    total: number;
  };
};

export default function MobileAttendancePage() {
  const router = useRouter();
  const auth = useMemo(() => loadMobileAuth(), []);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AttendanceListResponse | null>(null);

  async function load(page = 1) {
    setError(null);
    setBusy(true);
    try {
      const res = await mobileAuthFetch<AttendanceListResponse>(`/api/mobile/attendance?page=${page}&limit=20`);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "فشل تحميل السجل");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!auth?.accessToken) {
      router.replace("/m/login");
      return;
    }
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">سجل الحضور</div>
        <Button variant="outline" size="sm" disabled={busy} onClick={() => void load(data?.data?.page || 1)}>
          تحديث
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!data ? (
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      ) : data.data.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا يوجد سجلات بعد.</p>
      ) : (
        <div className="space-y-3">
          {data.data.items.map((r, idx) => {
            const d = r?.date ? new Date(r.date) : null;
            const ci = r?.checkInTime ? new Date(r.checkInTime) : null;
            const co = r?.checkOutTime ? new Date(r.checkOutTime) : null;

            return (
              <Card key={r?.id || idx} className="shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{d ? formatArabicDate(d, "ar") : "-"}</span>
                    <Badge variant={co ? "default" : ci ? "secondary" : "outline"}>
                      {co ? "منصرف" : ci ? "حاضر" : "بدون بصمة"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">دخول</span>
                    <span className="font-medium tabular-nums" dir="ltr">{ci ? formatTimeHHMM(ci, "ar") : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">خروج</span>
                    <span className="font-medium tabular-nums" dir="ltr">{co ? formatTimeHHMM(co, "ar") : "-"}</span>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    المصدر: {String(r?.source || "-")}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              className="w-full"
              disabled={busy || (data.data.page ?? 1) <= 1}
              onClick={() => void load(Math.max(1, (data.data.page ?? 1) - 1))}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={busy || (data.data.page ?? 1) * (data.data.limit ?? 20) >= (data.data.total ?? 0)}
              onClick={() => void load((data.data.page ?? 1) + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
