"use client";

import { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import {
  LeaveRequestStatus,
  leaveRequestStatusLabels,
  leaveRequestStatusColors,
  formatDateRange,
} from "@/lib/types/leave";
import { useEmployees } from "@/hooks/use-employees";

type ApiLeaveType = {
  id: string;
  name: string;
  nameAr?: string | null;
  code: string;
  color?: string | null;
  isActive: boolean;
};

type UiLeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  departmentId: string;
  departmentName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  isHalfDay: boolean;
  reason: string;
  status: LeaveRequestStatus;
  attachmentUrl?: string | null;
  delegateEmployeeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  approvedById?: string | null;
  rejectionReason?: string | null;
};

type LeavesListResponse = {
  data?: Array<any>;
  error?: string;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

type LeaveTypesResponse = {
  data?: Array<any>;
  error?: string;
};

function mapRequestStatusToUi(value: string | null | undefined): LeaveRequestStatus {
  switch (value) {
    case "PENDING":
      return "pending";
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "CANCELLED":
      return "cancelled";
    case "TAKEN":
      return "taken";
    default:
      return "pending";
  }
}

function toYmd(value: any): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toIso(value: any): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function toNumber(value: any): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function LeaveRequestsManager() {
  const { employees, departments, isLoading: isEmployeesLoading, error: employeesError } = useEmployees();

  const [requests, setRequests] = useState<UiLeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<ApiLeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<UiLeaveRequest | null>(null);
  const [activeTab, setActiveTab] = useState<LeaveRequestStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const leaveTypeById = useMemo(() => {
    const map = new Map<string, ApiLeaveType>();
    for (const t of leaveTypes) map.set(t.id, t);
    return map;
  }, [leaveTypes]);

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

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [leavesRes, typesRes] = await Promise.all([
        fetch("/api/leaves?limit=200", { cache: "no-store" }),
        fetch("/api/leave-types", { cache: "no-store" }),
      ]);

      const leavesJson = (await leavesRes.json()) as LeavesListResponse;
      const typesJson = (await typesRes.json()) as LeaveTypesResponse;

      if (!leavesRes.ok) {
        throw new Error(leavesJson.error || "فشل تحميل طلبات الإجازات");
      }
      if (!typesRes.ok) {
        throw new Error(typesJson.error || "فشل تحميل أنواع الإجازات");
      }

      const mappedTypes: ApiLeaveType[] = Array.isArray(typesJson.data)
        ? typesJson.data.map((t: any) => ({
            id: String(t.id),
            name: String(t.name ?? ""),
            nameAr: t.nameAr ?? null,
            code: String(t.code ?? ""),
            color: t.color ?? null,
            isActive: Boolean(t.isActive),
          }))
        : [];
      setLeaveTypes(mappedTypes);

      const mappedRequests: UiLeaveRequest[] = Array.isArray(leavesJson.data)
        ? leavesJson.data.map((r: any) => {
            const employeeName = r?.employee
              ? `${String(r.employee.firstName ?? "")} ${String(r.employee.lastName ?? "")}`.trim()
              : "";
            return {
              id: String(r.id),
              employeeId: String(r.employeeId ?? ""),
              employeeName,
              employeeNumber: String(r.employee?.employeeNumber ?? ""),
              departmentId: String(r.employee?.departmentId ?? ""),
              departmentName: String(r.employee?.department?.name ?? ""),
              leaveTypeId: String(r.leaveTypeId ?? ""),
              leaveTypeName: String(r.leaveType?.name ?? ""),
              startDate: toYmd(r.startDate),
              endDate: toYmd(r.endDate),
              totalDays: toNumber(r.totalDays),
              isHalfDay: toNumber(r.totalDays) === 0.5,
              reason: String(r.reason ?? ""),
              status: mapRequestStatusToUi(r.status),
              attachmentUrl: r.attachmentUrl ?? null,
              delegateEmployeeId: r.delegateToId ?? null,
              createdAt: toIso(r.createdAt),
              updatedAt: toIso(r.updatedAt),
              approvedAt: toIso(r.approvedAt) ?? null,
              approvedById: r.approvedById ?? null,
              rejectionReason: r.rejectionReason ?? null,
            };
          })
        : [];
      setRequests(mappedRequests);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRequest = async () => {
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          leaveTypeId: formData.leaveTypeId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          isHalfDay: formData.isHalfDay,
          delegateToId: formData.delegateEmployeeId || undefined,
        }),
      });

      const json = (await res.json()) as { data?: any; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "فشل إنشاء طلب الإجازة");
      }

      toast.success("تم إرسال طلب الإجازة");
      setIsAddDialogOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إنشاء طلب الإجازة");
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(`/api/leaves/${encodeURIComponent(selectedRequest.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", comment: approvalComment || undefined }),
      });
      const json = (await res.json()) as { data?: any; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "فشل الموافقة على الطلب");
      }
      toast.success("تمت الموافقة على الطلب");
      setIsApproveDialogOpen(false);
      setSelectedRequest(null);
      setApprovalComment("");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الموافقة على الطلب");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason) return;
    try {
      const res = await fetch(`/api/leaves/${encodeURIComponent(selectedRequest.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason }),
      });
      const json = (await res.json()) as { data?: any; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "فشل رفض الطلب");
      }
      toast.success("تم رفض الطلب");
      setIsRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل رفض الطلب");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/leaves/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "فشل إلغاء الطلب");
      }
      toast.success("تم إلغاء الطلب");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إلغاء الطلب");
    }
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim();
    return requests.filter((r) => {
      const matchesTab = activeTab === "all" || r.status === activeTab;
      const matchesSearch =
        !q ||
        r.employeeName.includes(q) ||
        r.employeeNumber.includes(q) ||
        r.leaveTypeName.includes(q);
      const matchesDepartment = filterDepartment === "all" || r.departmentId === filterDepartment;
      return matchesTab && matchesSearch && matchesDepartment;
    });
  }, [requests, activeTab, searchQuery, filterDepartment]);

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
                  {departments.map((dept) => (
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
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {loadError}
            </div>
          )}
          {employeesError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {employeesError}
            </div>
          )}
          {(isLoading || isEmployeesLoading) && (
            <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Progress value={35} className="h-2 w-40" />
              جاري التحميل...
            </div>
          )}
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
                          {leaveTypeById.get(request.leaveTypeId)?.code
                            ? `الرمز: ${leaveTypeById.get(request.leaveTypeId)?.code}`
                            : ""}
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
                    {employees.map((emp) => (
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
                    {leaveTypes
                      .filter((t) => t.isActive)
                      .map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: type.color || "#3B82F6" }}
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
                  {employees
                    .filter((e) => e.id !== formData.employeeId)
                    .map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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

              {selectedRequest.delegateEmployeeId && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">الموظف البديل</p>
                  <p className="font-medium">
                    {(() => {
                      const emp = employees.find((e) => e.id === selectedRequest.delegateEmployeeId);
                      return emp ? `${emp.firstName} ${emp.lastName}` : "غير معروف";
                    })()}
                  </p>
                </div>
              )}

              {/* Approval Info (real DB fields) */}
              {(selectedRequest.approvedAt || selectedRequest.rejectionReason) && (
                <div className="space-y-2">
                  <p className="font-medium">معلومات الاعتماد</p>
                  {selectedRequest.approvedAt && (
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">تاريخ الإجراء</span>
                        <span>{new Date(selectedRequest.approvedAt).toLocaleDateString("ar-SA")}</span>
                      </div>
                      {selectedRequest.approvedById && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-muted-foreground">المعتمد</span>
                          <span className="font-mono text-xs">{selectedRequest.approvedById}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedRequest.rejectionReason && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {selectedRequest.rejectionReason}
                    </div>
                  )}
                </div>
              )}

              {/* Attachment (single URL field) */}
              {selectedRequest.attachmentUrl && (
                <div className="space-y-2">
                  <p className="font-medium">المرفق</p>
                  <a
                    href={selectedRequest.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted"
                  >
                    <IconPaperclip className="h-4 w-4" />
                    <span className="text-sm">فتح المرفق</span>
                  </a>
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
