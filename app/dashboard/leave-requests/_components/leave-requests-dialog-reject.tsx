import { IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeaveRequestsRejectDialog({
  open,
  onOpenChange,
  rejectionReason,
  onRejectionReasonChange,
  onReject,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  onReject: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>رفض طلب الإجازة</DialogTitle>
          <DialogDescription>يرجى توضيح سبب الرفض</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>سبب الرفض *</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              placeholder="أدخل سبب الرفض..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onReject} variant="destructive" disabled={!rejectionReason}>
            <IconX className="ms-2 h-4 w-4" />
            رفض الطلب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
