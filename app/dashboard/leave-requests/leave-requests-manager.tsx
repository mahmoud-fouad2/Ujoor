"use client";

import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconSearch,
  IconFilter,
  IconEye,
  IconPaperclip,
  IconSend,
  IconCalendar,
  IconUser,
  IconBuilding,
  IconClock,
  IconMessage,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  LeaveRequest,
  LeaveRequestStatus,
  leaveRequestStatusLabels,
  leaveRequestStatusColors,
  leaveCategoryLabels,
  mockLeaveRequests,
  mockLeaveTypes,
  mockLeaveBalances,
  formatDateRange,
} from "@/lib/types/leave";
import { mockEmployees, mockDepartments } from "@/lib/types/core-hr";

export function LeaveRequestsManager() {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [activeTab, setActiveTab] = useState<LeaveRequestStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Form state for new request
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
    halfDayPeriod: "morning" as "morning" | "afternoon",
    delegateEmployeeId: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const resetForm = () => {
    setFormData({
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
      isHalfDay: false,
      halfDayPeriod: "morning",
      delegateEmployeeId: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
  };

  // Calculate days between dates
  const calculateDays = (start: string, end: string, isHalfDay: boolean): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isHalfDay ? 0.5 : diffDays;
  };

  const handleAddRequest = () => {
    const employee = mockEmployees.find((e) => e.id === formData.employeeId);
    const leaveType = mockLeaveTypes.find((t) => t.id === formData.leaveTypeId);
    const department = mockDepartments.find((d) => d.id === employee?.departmentId);
    const delegate = mockEmployees.find((e) => e.id === formData.delegateEmployeeId);

    if (!employee || !leaveType) return;

    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      tenantId: "tenant-1",
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeNumber: employee.employeeNumber,
      departmentId: employee.departmentId,
      departmentName: department?.name || "",
      leaveTypeId: leaveType.id,
      leaveTypeName: leaveType.name,
      leaveCategory: leaveType.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: calculateDays(formData.startDate, formData.endDate, formData.isHalfDay),
      isHalfDay: formData.isHalfDay,
      halfDayPeriod: formData.isHalfDay ? formData.halfDayPeriod : undefined,
      reason: formData.reason,
      attachments: [],
      status: "pending",
      approvalFlow: [
        {
          id: `apv-${Date.now()}`,
          approverId: "mgr-001",
          approverName: "المدير المباشر",
          approverRole: "مدير مباشر",
          order: 1,
          status: "pending",
        },
      ],
      currentApprover: "mgr-001",
      delegateEmployeeId: formData.delegateEmployeeId || undefined,
      delegateEmployeeName: delegate ? `${delegate.firstName} ${delegate.lastName}` : undefined,
      emergencyContact: formData.emergencyContact || undefined,
      emergencyPhone: formData.emergencyPhone || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    setRequests([newRequest, ...requests]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleApprove = () => {
    if (!selectedRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "approved",
              approvalFlow: r.approvalFlow.map((a) => ({
                ...a,
                status: "approved",
                comment: approvalComment,
                actionDate: new Date().toISOString(),
              })),
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setIsApproveDialogOpen(false);
    setSelectedRequest(null);
    setApprovalComment("");
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason) return;
    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "rejected",
              approvalFlow: r.approvalFlow.map((a) => ({
                ...a,
                status: "rejected",
                comment: rejectionReason,
                actionDate: new Date().toISOString(),
              })),
              rejectedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  const handleCancel = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? { ...r, status: "cancelled", updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesTab = activeTab === "all" || r.status === activeTab;
    const matchesSearch =
      r.employeeName.includes(searchQuery) ||
      r.employeeNumber.includes(searchQuery) ||
      r.leaveTypeName.includes(searchQuery);
    const matchesDepartment = filterDepartment === "all" || r.departmentId === filterDepartment;
    return matchesTab && matchesSearch && matchesDepartment;
  });

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    taken: requests.filter((r) => r.status === "taken").length,
  };

  const getStatusBadge = (status: LeaveRequestStatus) => (
    <Badge className={leaveRequestStatusColors[status]}>
      {leaveRequestStatusLabels[status]}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">طلبات الإجازات</h2>
          <p className="text-muted-foreground">إدارة ومتابعة طلبات الإجازات</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <IconPlus className="ms-2 h-4 w-4" />
          طلب إجازة جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الطلبات</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardDescription>قيد الانتظار</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>موافق عليها</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardDescription>مرفوضة</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>تم أخذها</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.taken}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LeaveRequestStatus | "all")}>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
                <TabsTrigger value="approved">موافق عليها</TabsTrigger>
                <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
                <TabsTrigger value="taken">تم أخذها</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px] ps-9"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="جميع الأقسام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد طلبات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {request.employeeName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.departmentName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.leaveTypeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {leaveCategoryLabels[request.leaveCategory]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateRange(request.startDate, request.endDate)}
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <IconEye className="ms-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {request.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsApproveDialogOpen(true);
                                }}
                              >
                                <IconCheck className="ms-2 h-4 w-4" />
                                موافقة
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                <IconX className="ms-2 h-4 w-4" />
                                رفض
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleCancel(request.id)}
                              >
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
        </CardContent>
      </Card>

      {/* Add Request Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>طلب إجازة جديد</DialogTitle>
            <DialogDescription>إنشاء طلب إجازة للموظف</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الموظف *</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} - {emp.employeeNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>نوع الإجازة *</Label>
                <Select
                  value={formData.leaveTypeId}
                  onValueChange={(value) => setFormData({ ...formData, leaveTypeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الإجازة" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLeaveTypes.filter((t) => t.isActive).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>تاريخ البداية *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ النهاية *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">عدد الأيام:</span>
                  <Badge variant="secondary">
                    {calculateDays(formData.startDate, formData.endDate, formData.isHalfDay)}{" "}
                    {formData.isHalfDay ? "نصف يوم" : "يوم"}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Switch
                checked={formData.isHalfDay}
                onCheckedChange={(checked) => setFormData({ ...formData, isHalfDay: checked })}
              />
              <Label>نصف يوم فقط</Label>
              {formData.isHalfDay && (
                <Select
                  value={formData.halfDayPeriod}
                  onValueChange={(value: "morning" | "afternoon") =>
                    setFormData({ ...formData, halfDayPeriod: value })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">الفترة الصباحية</SelectItem>
                    <SelectItem value="afternoon">الفترة المسائية</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>سبب الإجازة *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="أدخل سبب الإجازة..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>الموظف البديل (اختياري)</Label>
              <Select
                value={formData.delegateEmployeeId}
                onValueChange={(value) => setFormData({ ...formData, delegateEmployeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الموظف البديل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون بديل</SelectItem>
                  {mockEmployees
                    .filter((e) => e.id !== formData.employeeId)
                    .map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>جهة اتصال الطوارئ</Label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="الاسم"
                />
              </div>
              <div className="space-y-2">
                <Label>رقم هاتف الطوارئ</Label>
                <Input
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleAddRequest}
              disabled={
                !formData.employeeId ||
                !formData.leaveTypeId ||
                !formData.startDate ||
                !formData.endDate ||
                !formData.reason
              }
            >
              <IconSend className="ms-2 h-4 w-4" />
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب الإجازة</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedRequest.employeeName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedRequest.employeeName}</h3>
                  <p className="text-muted-foreground">{selectedRequest.departmentName}</p>
                  <p className="text-sm text-muted-foreground">
                    الرقم الوظيفي: {selectedRequest.employeeNumber}
                  </p>
                </div>
                <div className="ms-auto">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <Separator />

              {/* Leave Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">نوع الإجازة</p>
                  <p className="font-medium">{selectedRequest.leaveTypeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">المدة</p>
                  <p className="font-medium">
                    {selectedRequest.totalDays}{" "}
                    {selectedRequest.totalDays === 1 ? "يوم" : "أيام"}
                    {selectedRequest.isHalfDay && " (نصف يوم)"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">تاريخ البداية</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.startDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">تاريخ النهاية</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.endDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">السبب</p>
                <p className="rounded-lg bg-muted p-3">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.delegateEmployeeName && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">الموظف البديل</p>
                  <p className="font-medium">{selectedRequest.delegateEmployeeName}</p>
                </div>
              )}

              {/* Approval Flow */}
              <div className="space-y-3">
                <p className="font-medium">مسار الموافقة</p>
                {selectedRequest.approvalFlow.map((approval, index) => (
                  <div
                    key={approval.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        approval.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : approval.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {approval.status === "approved" ? (
                        <IconCheck className="h-4 w-4" />
                      ) : approval.status === "rejected" ? (
                        <IconX className="h-4 w-4" />
                      ) : (
                        <IconClock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{approval.approverName}</p>
                      <p className="text-sm text-muted-foreground">{approval.approverRole}</p>
                      {approval.comment && (
                        <p className="mt-1 text-sm">{approval.comment}</p>
                      )}
                    </div>
                    {approval.actionDate && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(approval.actionDate).toLocaleDateString("ar-SA")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Attachments */}
              {selectedRequest.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">المرفقات</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted"
                      >
                        <IconPaperclip className="h-4 w-4" />
                        <span className="text-sm">{att.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الموافقة على طلب الإجازة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من الموافقة على هذا الطلب؟
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>تعليق (اختياري)</Label>
              <Textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="أضف تعليقاً..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <IconCheck className="ms-2 h-4 w-4" />
              موافقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
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
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="أدخل سبب الرفض..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={!rejectionReason}
            >
              <IconX className="ms-2 h-4 w-4" />
              رفض الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
