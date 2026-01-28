"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { tenantsService } from "@/lib/api";

export function RequestActions({
  requestId,
  status,
}: {
  requestId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
}) {
  const [isActing, setIsActing] = React.useState(false);

  const canAct = status === "PENDING";

  const approve = async () => {
    setIsActing(true);
    try {
      const res = await tenantsService.approveRequest(requestId, {});
      if (!res.success) {
        toast.error(res.error || "تعذر قبول الطلب");
        return;
      }
      toast.success("تم قبول الطلب وإنشاء الشركة");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر قبول الطلب");
    } finally {
      setIsActing(false);
    }
  };

  const reject = async () => {
    const reason = window.prompt("سبب الرفض (اختياري):") ?? "";

    setIsActing(true);
    try {
      const res = await tenantsService.rejectRequest(requestId, reason);
      if (!res.success) {
        toast.error(res.error || "تعذر رفض الطلب");
        return;
      }
      toast.success("تم رفض الطلب");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر رفض الطلب");
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={approve} disabled={!canAct || isActing}>
        قبول وإنشاء شركة
      </Button>
      <Button variant="outline" onClick={reject} disabled={!canAct || isActing}>
        رفض
      </Button>
    </div>
  );
}
