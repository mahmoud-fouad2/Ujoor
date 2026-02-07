"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarCheck,
  ClipboardList,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Plane,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import MobileHeader from "@/components/mobile/mobile-header";
import {
  formatTimeHHMM,
  formatArabicDate,
  formatDayName,
  greeting,
  getInitials,
  getCurrentPositionSafe,
} from "@/components/mobile/mobile-utils";
import {
  loadMobileAuth,
  mobileAuthFetch,
  mobileChallenge,
} from "@/lib/mobile/web-client";

type TodayStatus = {
  status: "NONE" | "CHECKED_IN" | "CHECKED_OUT";
  canCheckIn: boolean;
  canCheckOut: boolean;
  record?: {
    checkInTime?: string | null;
    checkOutTime?: string | null;
  } | null;
};

const quickActions = [
  { label: "تصحيح حضور", href: "/m/attendance", icon: CalendarCheck, color: "from-blue-500 to-blue-600" },
  { label: "طلب إجازة", href: "/m/requests", icon: Plane, color: "from-emerald-500 to-emerald-600" },
  { label: "الطلبات", href: "/m/requests", icon: FileText, color: "from-amber-500 to-amber-600" },
  { label: "السجل", href: "/m/attendance", icon: ClipboardList, color: "from-violet-500 to-violet-600" },
];

export default function MobileHomePage() {
  const router = useRouter();

  /* ───── Auth ───── */
  const auth = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadMobileAuth();
  }, []);

  useEffect(() => {
    if (!auth) router.replace("/m/login");
  }, [auth, router]);

  /* ───── Clock ───── */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  /* ───── Attendance Status ───── */
  const [today, setToday] = useState<TodayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "locating" | "ok" | "fail">("idle");
  const didFetch = useRef(false);

  const fetchToday = useCallback(async () => {
    try {
      const res = await mobileAuthFetch<{ data: TodayStatus }>("/api/mobile/attendance/today");
      setToday(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!didFetch.current && auth) {
      didFetch.current = true;
      fetchToday();
    }
  }, [auth, fetchToday]);

  /* ───── Check-in / Check-out ───── */
  async function handleAttendance(type: "check-in" | "check-out") {
    setActionBusy(true);
    setGpsStatus("locating");
    try {
      const pos = await getCurrentPositionSafe({ timeoutMs: 8000 });
      setGpsStatus(pos ? "ok" : "fail");

      const nonce = await mobileChallenge();

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

      await fetchToday();
    } catch (err: any) {
      alert(err?.message || "فشلت العملية");
    } finally {
      setActionBusy(false);
      setTimeout(() => setGpsStatus("idle"), 3000);
    }
  }

  /* ───── Derived ───── */
  const user = auth?.user;
  const displayName = user?.firstName || "مستخدم";
  const dateText = formatArabicDate(now);
  const dayName = formatDayName(now);

  if (!auth) return null;

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      <MobileHeader
        dateText={dateText}
        avatarUrl={user?.avatar}
        initials={getInitials(user?.firstName, user?.lastName)}
      />

      {/* ── Greeting ── */}
      <div className="space-y-0.5 pt-1">
        <h1 className="text-[22px] font-bold text-slate-800">
          {greeting("ar", now)}، {displayName} 👋
        </h1>
        <p className="text-[13px] text-slate-400">{dayName}</p>
      </div>

      {/* ── Attendance Card ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-5 text-white shadow-xl shadow-slate-900/20">
        {/* Decorative orb */}
        <div className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 -right-6 size-32 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* Status Chip */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold backdrop-blur">
          <span
            className={
              "inline-block size-1.5 rounded-full " +
              (today?.status === "CHECKED_IN" ? "bg-emerald-400 animate-pulse" : today?.status === "CHECKED_OUT" ? "bg-sky-400" : "bg-slate-400")
            }
          />
          {today?.status === "CHECKED_IN" ? "في العمل" : today?.status === "CHECKED_OUT" ? "انتهى الدوام" : "لم يبدأ بعد"}
        </div>

        {/* Clock */}
        <div className="mb-5 flex items-end gap-2">
          <span className="text-[42px] font-extrabold tabular-nums leading-none tracking-tight">
            {formatTimeHHMM(now)}
          </span>
          <Clock className="mb-1 size-5 text-white/40" />
        </div>

        {/* Check-in / Check-out times */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <TimeChip
            label="تسجيل الحضور"
            time={today?.record?.checkInTime}
            icon={<ArrowDownToLine className="size-3.5 text-emerald-400" />}
          />
          <TimeChip
            label="تسجيل الانصراف"
            time={today?.record?.checkOutTime}
            icon={<ArrowUpFromLine className="size-3.5 text-sky-400" />}
          />
        </div>

        {/* GPS status */}
        {gpsStatus !== "idle" && (
          <div className="mb-3 flex items-center gap-1.5 text-[11px] text-white/50">
            <MapPin className="size-3" />
            {gpsStatus === "locating" && "جاري تحديد الموقع…"}
            {gpsStatus === "ok" && "تم تحديد الموقع ✓"}
            {gpsStatus === "fail" && "تعذر تحديد الموقع"}
          </div>
        )}

        {/* CTA Button */}
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="size-6 animate-spin text-white/40" />
          </div>
        ) : today?.canCheckIn ? (
          <Button
            onClick={() => handleAttendance("check-in")}
            disabled={actionBusy}
            className="h-12 w-full rounded-2xl bg-emerald-500 text-[15px] font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
          >
            {actionBusy ? <Loader2 className="size-5 animate-spin" /> : "تسجيل الحضور"}
          </Button>
        ) : today?.canCheckOut ? (
          <Button
            onClick={() => handleAttendance("check-out")}
            disabled={actionBusy}
            className="h-12 w-full rounded-2xl bg-sky-500 text-[15px] font-bold shadow-lg shadow-sky-500/30 hover:bg-sky-600"
          >
            {actionBusy ? <Loader2 className="size-5 animate-spin" /> : "تسجيل الانصراف"}
          </Button>
        ) : (
          <div className="rounded-2xl bg-white/5 py-3 text-center text-sm text-white/40">
            لا يوجد إجراء متاح حالياً
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="mb-3 text-[15px] font-bold text-slate-700">خدمات سريعة</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 transition active:scale-95"
            >
              <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-sm`}>
                <action.icon className="size-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-center text-[11px] font-semibold leading-tight text-slate-600">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Today Summary ── */}
      {today?.record && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-[13px] font-bold text-slate-600">ملخص اليوم</h3>
          <div className="space-y-2 text-[13px] text-slate-500">
            {today.record.checkInTime && (
              <div className="flex justify-between">
                <span>وقت الحضور</span>
                <span className="tabular-nums font-medium text-slate-700">
                  {formatTimeHHMM(new Date(today.record.checkInTime))}
                </span>
              </div>
            )}
            {today.record.checkOutTime && (
              <div className="flex justify-between">
                <span>وقت الانصراف</span>
                <span className="tabular-nums font-medium text-slate-700">
                  {formatTimeHHMM(new Date(today.record.checkOutTime))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function TimeChip({
  label,
  time,
  icon,
}: {
  label: string;
  time?: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/5 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] text-white/50">{icon}{label}</div>
      <p className="mt-1 text-[16px] font-bold tabular-nums">
        {time ? formatTimeHHMM(new Date(time)) : "--:--"}
      </p>
    </div>
  );
}
