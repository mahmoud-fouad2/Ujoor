import { IconCheck } from "@tabler/icons-react";

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

export function LeaveRequestsApproveDialog({
  open,
  onOpenChange,
  approvalComment,
  onApprovalCommentChange,
  onApprove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvalComment: string;
  onApprovalCommentChange: (value: string) => void;
  onApprove: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>الموافقة على طلب الإجازة</DialogTitle>
          <DialogDescription>هل أنت متأكد من الموافقة على هذا الطلب؟</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>تعليق (اختياري)</Label>
            <Textarea
              value={approvalComment}
              onChange={(e) => onApprovalCommentChange(e.target.value)}
              placeholder="أضف تعليقاً..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
            <IconCheck className="ms-2 h-4 w-4" />
            موافقة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
