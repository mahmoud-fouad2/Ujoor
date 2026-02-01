import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function LeaveRequestsHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">طلبات الإجازات</h2>
        <p className="text-muted-foreground">إدارة ومتابعة طلبات الإجازات</p>
      </div>
      <Button onClick={onAdd}>
        <IconPlus className="ms-2 h-4 w-4" />
        طلب إجازة جديد
      </Button>
    </div>
  );
}
