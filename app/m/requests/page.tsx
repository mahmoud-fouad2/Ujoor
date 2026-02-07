"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { loadMobileAuth, mobileAuthFetch } from "@/lib/mobile/web-client";

type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

type SelfServiceRequest = {
  id: string;
  type: string;
  title: string;
  description?: string;
  status: RequestStatus;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  metadata?: any;
};

type ListResponse = { data: { items: SelfServiceRequest[] } };

type CreateTicketResponse = { data: SelfServiceRequest };

function statusBadgeVariant(status: RequestStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  if (status === "cancelled") return "outline";
  return "secondary";
}

function statusLabel(status: RequestStatus) {
  switch (status) {
    case "approved":
      return "تمت الموافقة";
    case "rejected":
      return "مرفوض";
    case "cancelled":
      return "ملغي";
    default:
      return "قيد المراجعة";
  }
}

export default function MobileRequestsPage() {
  const router = useRouter();
  const auth = useMemo(() => loadMobileAuth(), []);
  const search = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SelfServiceRequest[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await mobileAuthFetch<ListResponse>("/api/mobile/my-requests");
      setItems(res?.data?.items || []);
    } catch (e: any) {
      setError(e?.message || "فشل تحميل الطلبات");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const newType = search?.get("new");
    if (newType === "ticket") {
      // Pre-fill common defaults
      if (!title) setTitle("طلب دعم");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function createTicket() {
    if (!title.trim() || description.trim().length < 3) {
      setError("اكتب عنوان ووصف لا يقل عن 3 أحرف");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const res = await mobileAuthFetch<CreateTicketResponse>("/api/mobile/my-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "ticket",
          title: title.trim(),
          description: description.trim(),
          priority: "medium",
        }),
      });

      setTitle("");
      setDescription("");
      setItems((prev) => [res.data, ...prev]);
    } catch (e: any) {
      setError(e?.message || "فشل إنشاء الطلب");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">طلباتك</div>
        <Button variant="outline" size="sm" disabled={loading} onClick={() => void load()}>
          تحديث
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="py-4">
          <CardTitle className="text-base">طلب جديد (دعم)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label>العنوان</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: مشكلة في البصمة" disabled={creating} />
          </div>
          <div className="grid gap-2">
            <Label>الوصف</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="اشرح المشكلة باختصار..." disabled={creating} />
            <p className="text-xs text-muted-foreground">سيتم إنشاء تذكرة دعم تلقائيًا.</p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" onClick={() => void createTicket()} disabled={creating}>
            {creating ? "جاري الإرسال..." : "إرسال"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {loading ? (
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 30).map((r) => (
            <Card key={r.id} className="shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="flex items-start justify-between gap-3 text-base">
                  <span className="min-w-0 truncate">{r.title}</span>
                  <Badge variant={statusBadgeVariant(r.status)}>{statusLabel(r.status)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {r.description ? <div className="text-muted-foreground line-clamp-2">{r.description}</div> : null}
                <div className="text-xs text-muted-foreground" dir="ltr">
                  {new Date(r.createdAt).toLocaleString("ar-EG")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
