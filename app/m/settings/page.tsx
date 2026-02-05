"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  loadMobileAuth,
  mobileAuthFetch,
  mobileLogoutAll,
  saveMobileAuth,
} from "@/lib/mobile/web-client";

type MeResponse = {
  data: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    tenant?: { id: string; slug: string; name: string; nameAr: string | null } | null;
    employee?: { id: string; employeeNumber: string | null; firstName: string | null; lastName: string | null } | null;
  };
};

export default function MobileSettingsPage() {
  const router = useRouter();
  const auth = useMemo(() => loadMobileAuth(), []);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMe() {
    setError(null);
    try {
      const res = await mobileAuthFetch<MeResponse>("/api/mobile/me");
      setMe(res);
    } catch (e: any) {
      setError(e?.message || "فشل تحميل البيانات");
    }
  }

  useEffect(() => {
    if (!auth?.accessToken) {
      router.replace("/m/login");
      return;
    }
    void loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function uploadAvatar(file: File) {
    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await mobileAuthFetch<{ data: { url: string } }>("/api/mobile/me/avatar", {
        method: "POST",
        body: formData,
      });

      const url = res?.data?.url;
      if (url && auth) {
        saveMobileAuth({ ...auth, user: { ...auth.user, avatar: url } });
      }

      await loadMe();
    } catch (e: any) {
      setError(e?.message || "فشل رفع الصورة");
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

  const displayName =
    (me?.data?.firstName || "") + (me?.data?.lastName ? ` ${me.data.lastName}` : "");

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">الإعدادات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={me?.data?.avatar || auth?.user?.avatar || ""} alt={displayName || "avatar"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="font-medium truncate">{displayName || me?.data?.email || ""}</div>
              <div className="text-xs text-muted-foreground truncate">
                {me?.data?.tenant?.nameAr || me?.data?.tenant?.name || ""}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">تغيير الصورة</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAvatar(file);
              }}
            />
            <p className="text-xs text-muted-foreground">حد أقصى 3MB</p>
          </div>

          <Separator />

          <div className="space-y-1 text-sm">
            <div>
              البريد: <span className="font-medium" dir="ltr">{me?.data?.email || ""}</span>
            </div>
            <div>
              رقم الموظف: <span className="font-medium">{me?.data?.employee?.employeeNumber || "-"}</span>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex gap-2">
            <Button variant="secondary" className="w-full" onClick={() => router.push("/m/home")} disabled={busy}>
              رجوع
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => void logout()} disabled={busy}>
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
