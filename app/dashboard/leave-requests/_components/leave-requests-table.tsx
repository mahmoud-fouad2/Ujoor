import { IconCheck, IconEye, IconTrash, IconX } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaveRequestStatus } from "@/lib/types/leave";
import { formatDateRange } from "@/lib/types/leave";

import type { UiLeaveRequest } from "./leave-requests-types";

export function LeaveRequestsTable({
  requests,
  getLeaveTypeCode,
  getStatusBadge,
  onView,
  onApprove,
  onReject,
  onCancel,
}: {
  requests: UiLeaveRequest[];
  getLeaveTypeCode: (leaveTypeId: string) => string;
  getStatusBadge: (status: LeaveRequestStatus) => React.ReactNode;
  onView: (request: UiLeaveRequest) => void;
  onApprove: (request: UiLeaveRequest) => void;
  onReject: (request: UiLeaveRequest) => void;
  onCancel: (requestId: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الموظف</TableHead>
          <TableHead>نوع الإجازة</TableHead>
          <TableHead>الفترة</TableHead>
          <TableHead>المدة</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="w-[120px]">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <p className="text-muted-foreground">لا توجد طلبات</p>
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{request.employeeName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{request.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{request.departmentName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{request.leaveTypeName}</div>
                  <div className="text-sm text-muted-foreground">
                    {getLeaveTypeCode(request.leaveTypeId)
                      ? `الرمز: ${getLeaveTypeCode(request.leaveTypeId)}`
                      : ""}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatDateRange(request.startDate, request.endDate)}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {request.totalDays} {request.totalDays === 1 ? "يوم" : "أيام"}
                  {request.isHalfDay && " (نصف يوم)"}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      إجراءات
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(request)}>
                      <IconEye className="ms-2 h-4 w-4" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    {request.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-green-600" onClick={() => onApprove(request)}>
                          <IconCheck className="ms-2 h-4 w-4" />
                          موافقة
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onReject(request)}>
                          <IconX className="ms-2 h-4 w-4" />
                          رفض
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onCancel(request.id)}>
                          <IconTrash className="ms-2 h-4 w-4" />
                          إلغاء الطلب
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
