"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconClock,
  IconCheck,
  IconX,
  IconFileDescription,
  IconCalendarTime,
  IconHome,
  IconClockEdit,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type AttendanceRequest,
  type AttendanceRequestType,
  type AttendanceRequestStatus,
  requestTypeLabels,
  requestStatusLabels,
} from "@/lib/types/attendance";
import { attendanceService } from "@/lib/api";
import { useEmployees } from "@/hooks/use-employees";

export function RequestsManager() {
  const { employees, getEmployeeFullName } = useEmployees();
  const [requests, setRequests] = React.useState<AttendanceRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<AttendanceRequestStatus | "all">("all");
  const [typeFilter, setTypeFilter] = React.useState<AttendanceRequestType | "all">("all");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"my" | "pending">("my");

  // Form state
  const [formData, setFormData] = React.useState({
    type: "check_correction" as AttendanceRequestType,
    date: "",
    requestedCheckIn: "",
    requestedCheckOut: "",
    overtimeHours: 1,
    permissionStartTime: "",
    permissionEndTime: "",
    reason: "",
  });

  const currentUserId = employees[0]?.id;
  // TODO: derive from auth/roles
  const canApprove = false;

  const fetchRequests = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      } else {
        setRequests([]);
        setError(res.error || "فشل تحميل الطلبات");
      }
    } catch (e) {
      setRequests([]);
      setError(e instanceof Error ? e.message : "فشل تحميل الطلبات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter requests
  const myRequests = currentUserId ? requests.filter((r) => r.employeeId === currentUserId) : [];
  const pendingApprovalRequests = requests.filter(
    (r) => r.status === "pending" && (!currentUserId || r.employeeId !== currentUserId)
  );

  const displayedRequests = activeTab === "my" ? myRequests : pendingApprovalRequests;

  const filteredRequests = displayedRequests.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: myRequests.length,
    pending: myRequests.filter((r) => r.status === "pending").length,
    approved: myRequests.filter((r) => r.status === "approved").length,
    rejected: myRequests.filter((r) => r.status === "rejected").length,
    pendingApproval: canApprove ? pendingApprovalRequests.length : 0,
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "check_correction",
      date: "",
      requestedCheckIn: "",
      requestedCheckOut: "",
      overtimeHours: 1,
      permissionStartTime: "",
      permissionEndTime: "",
      reason: "",
    });
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      setError("لا يوجد موظف مسجل لتقديم طلب");
      return;
    }
    if (!formData.date || !formData.reason) {
      setError("الرجاء إدخال التاريخ والسبب");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        employeeId: currentUserId,
        type: formData.type,
        date: formData.date,
        reason: formData.reason,
      };

      if (formData.type === "check_correction") {
        payload.requestedCheckIn = formData.requestedCheckIn
          ? `${formData.date}T${formData.requestedCheckIn}:00Z`
          : undefined;
        payload.requestedCheckOut = formData.requestedCheckOut
          ? `${formData.date}T${formData.requestedCheckOut}:00Z`
          : undefined;
      } else if (formData.type === "overtime") {
        payload.overtimeHours = formData.overtimeHours;
      } else if (formData.type === "permission") {
        payload.permissionStartTime = formData.permissionStartTime;
        payload.permissionEndTime = formData.permissionEndTime;
      }

      const res = await attendanceService.createRequest(
        payload as Parameters<typeof attendanceService.createRequest>[0]
      );

      if (!res.success) {
        setError(res.error || "فشل تقديم الطلب");
        return;
      }

      await fetchRequests();
      setIsAddOpen(false);
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل تقديم الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproval = async (requestId: string, approved: boolean, rejectionReason?: string) => {
    if (!canApprove) return;
    setError(null);
    try {
      const res = approved
        ? await attendanceService.approveRequest(requestId)
        : await attendanceService.rejectRequest(requestId, rejectionReason || "");
      if (!res.success) {
        setError(res.error || "فشل تحديث الطلب");
        return;
      }
      await fetchRequests();
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل تحديث الطلب");
    }
  };

  // Get employee name
  const getEmployeeName = (employeeId: string) => {
    return getEmployeeFullName(employeeId);
  };

  // Get type icon
  const getTypeIcon = (type: AttendanceRequestType) => {
    switch (type) {
      case "check_correction":
        return <IconClockEdit className="h-4 w-4" />;
      case "overtime":
        return <IconClock className="h-4 w-4" />;
      case "permission":
        return <IconCalendarTime className="h-4 w-4" />;
      case "work_from_home":
        return <IconHome className="h-4 w-4" />;
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: AttendanceRequestStatus) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي طلباتي</CardTitle>
            <IconFileDescription className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الموافقة</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معتمدة</CardTitle>
            <IconCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرفوضة</CardTitle>
            <IconX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        {canApprove && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تحتاج موافقتك</CardTitle>
              <IconClock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendingApproval}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "my" | "pending")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="my">طلباتي</TabsTrigger>
            {canApprove && (
              <TabsTrigger value="pending">
                بانتظار الموافقة
                {stats.pendingApproval > 0 && (
                  <Badge variant="destructive" className="me-2 h-5 w-5 p-0 justify-center">
                    {stats.pendingApproval}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex items-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as AttendanceRequestType | "all")}
            >
              <SelectTrigger className="w-[150px]">
                <IconFilter className="h-4 w-4 ms-2" />
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                {Object.entries(requestTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label.ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeTab === "my" && (
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as AttendanceRequestStatus | "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  {Object.entries(requestStatusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* New Request Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <IconPlus className="ms-2 h-4 w-4" />
                  طلب جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>طلب جديد</DialogTitle>
                  <DialogDescription>
                    اختر نوع الطلب وأدخل التفاصيل المطلوبة
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Request Type */}
                  <div className="space-y-2">
                    <Label>نوع الطلب</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, type: v as AttendanceRequestType }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(requestTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(key as AttendanceRequestType)}
                              {label.ar}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label>التاريخ</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                    />
                  </div>

                  {/* Check Correction Fields */}
                  {formData.type === "check_correction" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>وقت الحضور الصحيح</Label>
                        <Input
                          type="time"
                          value={formData.requestedCheckIn}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, requestedCheckIn: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>وقت الانصراف الصحيح</Label>
                        <Input
                          type="time"
                          value={formData.requestedCheckOut}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, requestedCheckOut: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Overtime Fields */}
                  {formData.type === "overtime" && (
                    <div className="space-y-2">
                      <Label>عدد ساعات العمل الإضافي</Label>
                      <Input
                        type="number"
                        value={formData.overtimeHours}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            overtimeHours: parseInt(e.target.value) || 1,
                          }))
                        }
                        min={1}
                        max={12}
                      />
                    </div>
                  )}

                  {/* Permission Fields */}
                  {formData.type === "permission" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>من الساعة</Label>
                        <Input
                          type="time"
                          value={formData.permissionStartTime}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              permissionStartTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>إلى الساعة</Label>
                        <Input
                          type="time"
                          value={formData.permissionEndTime}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              permissionEndTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label>السبب</Label>
                    <Textarea
                      value={formData.reason}
                      onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                      placeholder="اكتب سبب الطلب..."
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.date || !formData.reason}
                  >
                    تقديم الطلب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="my">
          <RequestsTable
            requests={filteredRequests}
            getEmployeeName={getEmployeeName}
            getTypeIcon={getTypeIcon}
            getStatusVariant={getStatusVariant}
            isApprovalMode={false}
          />
        </TabsContent>

        <TabsContent value="pending">
          <RequestsTable
            requests={filteredRequests}
            getEmployeeName={getEmployeeName}
            getTypeIcon={getTypeIcon}
            getStatusVariant={getStatusVariant}
            isApprovalMode={true}
            onApprove={(id) => handleApproval(id, true)}
            onReject={(id) => handleApproval(id, false, "مرفوض من المدير")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Requests Table Component
interface RequestsTableProps {
  requests: AttendanceRequest[];
  getEmployeeName: (id: string) => string;
  getTypeIcon: (type: AttendanceRequestType) => React.ReactNode;
  getStatusVariant: (status: AttendanceRequestStatus) => "default" | "secondary" | "destructive";
  isApprovalMode: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function RequestsTable({
  requests,
  getEmployeeName,
  getTypeIcon,
  getStatusVariant,
  isApprovalMode,
  onApprove,
  onReject,
}: RequestsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isApprovalMode ? "طلبات تحتاج موافقتك" : "طلباتي"}</CardTitle>
        <CardDescription>
          {requests.length} طلب
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {isApprovalMode && <TableHead>الموظف</TableHead>}
              <TableHead>نوع الطلب</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>التفاصيل</TableHead>
              <TableHead>السبب</TableHead>
              {!isApprovalMode && <TableHead>الحالة</TableHead>}
              <TableHead>تاريخ التقديم</TableHead>
              {isApprovalMode && <TableHead className="text-start">إجراءات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isApprovalMode ? 7 : 6} className="text-center py-8">
                  <IconFileDescription className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">لا توجد طلبات</p>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  {isApprovalMode && (
                    <TableCell className="font-medium">
                      {getEmployeeName(request.employeeId)}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(request.type)}
                      <span>{requestTypeLabels[request.type].ar}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(request.date).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {request.type === "check_correction" && request.requestedCheckIn && (
                      <span>
                        {new Date(request.requestedCheckIn).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {request.requestedCheckOut &&
                          new Date(request.requestedCheckOut).toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </span>
                    )}
                    {request.type === "overtime" && (
                      <span>{request.overtimeHours} ساعات</span>
                    )}
                    {request.type === "permission" && (
                      <span>
                        {request.permissionStartTime} - {request.permissionEndTime}
                      </span>
                    )}
                    {request.type === "work_from_home" && <span>يوم كامل</span>}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {request.reason}
                  </TableCell>
                  {!isApprovalMode && (
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>
                        {requestStatusLabels[request.status].ar}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString("ar-SA")}
                  </TableCell>
                  {isApprovalMode && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onApprove?.(request.id)}
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onReject?.(request.id)}
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
