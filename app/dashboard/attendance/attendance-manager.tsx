"use client";

import * as React from "react";
import {
  IconSearch,
  IconFilter,
  IconClock,
  IconLogin,
  IconLogout,
  IconCalendar,
  IconChevronRight,
  IconChevronLeft,
  IconAlertCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { TableEmptyRow } from "@/components/empty-states/table-empty-row";
import { Badge } from "@/components/ui/badge";
import {
  type AttendanceRecord,
  type AttendanceStatus,
  attendanceStatusLabels,
  formatTime,
  formatMinutesToHours,
  getStatusColor,
} from "@/lib/types/attendance";
import { attendanceService } from "@/lib/api";
import { useEmployees } from "@/hooks/use-employees";

export function AttendanceManager() {
  const { employees, getEmployeeFullName } = useEmployees();
  const [records, setRecords] = React.useState<AttendanceRecord[]>([]);
  const [shifts, setShifts] = React.useState<{ id: string; nameAr?: string; name?: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [statusFilter, setStatusFilter] = React.useState<AttendanceStatus | "all">("all");
  const [employeeFilter, setEmployeeFilter] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"day" | "month">("month");

  const currentUserId = employees[0]?.id;

  const startDate = React.useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-01`;
  }, [selectedDate]);

  const endDate = React.useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const last = new Date(y, m + 1, 0).getDate();
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
  }, [selectedDate]);

  const fetchMonthData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recordsRes, shiftsRes] = await Promise.all([
        attendanceService.getRecords({ startDate, endDate }),
        attendanceService.getShifts(),
      ]);

      if (recordsRes.success && recordsRes.data) {
        setRecords(recordsRes.data);
      } else {
        setRecords([]);
        setError(recordsRes.error || "فشل تحميل سجلات الحضور");
      }

      if (shiftsRes.success && shiftsRes.data) {
        setShifts(shiftsRes.data);
      } else {
        setShifts([]);
      }
    } catch (e) {
      setRecords([]);
      setShifts([]);
      setError(e instanceof Error ? e.message : "فشل تحميل بيانات الحضور");
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  React.useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  // Current month navigation
  const currentMonth = selectedDate.toLocaleString("ar-SA", { month: "long", year: "numeric" });
  
  // Get days in month
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  // Navigate month
  const navigateMonth = (direction: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  // Filter records for selected month
  const monthRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Apply filters
  const filteredRecords = monthRecords.filter((record) => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesEmployee = employeeFilter === "all" || record.employeeId === employeeFilter;
    return matchesStatus && matchesEmployee;
  });

  // Stats for the month
  const stats = {
    totalWorkDays: monthRecords.filter((r) => !["weekend", "holiday"].includes(r.status)).length,
    present: monthRecords.filter((r) => r.status === "present").length,
    late: monthRecords.filter((r) => r.status === "late").length,
    absent: monthRecords.filter((r) => r.status === "absent").length,
    totalLateMinutes: monthRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0),
    avgWorkHours: Math.round(
      monthRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) /
        Math.max(1, monthRecords.filter((r) => r.totalWorkMinutes).length) /
        60 * 10
    ) / 10,
  };

  // Get employee name
  const getEmployeeName = (employeeId: string) => {
    return getEmployeeFullName(employeeId);
  };

  // Get shift name
  const getShiftName = (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return shift?.nameAr || shift?.name || "غير محدد";
  };

  // Format datetime to time
  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const StatusBadge = ({ status }: { status: AttendanceStatus }) => {
    const colorClass = getStatusColor(status).replace("bg-", "");
    return (
      <Badge
        variant="outline"
        className={`border-${colorClass} text-${colorClass}`}
        style={{
          borderColor: getStatusColor(status).replace("bg-", ""),
        }}
      >
        <span
          className={`w-2 h-2 rounded-full me-1.5 ${getStatusColor(status)}`}
        />
        {attendanceStatusLabels[status].ar}
      </Badge>
    );
  };

  const handleQuickCheckIn = async () => {
    if (!currentUserId) {
      setError("لا يوجد موظف مسجل لاستخدام التسجيل السريع");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const existingRecord = records.find((r) => r.date === today && r.employeeId === currentUserId);

    try {
      setError(null);
      if (existingRecord && !existingRecord.checkOutTime) {
        await attendanceService.checkOut({ employeeId: currentUserId });
      } else if (!existingRecord) {
        await attendanceService.checkIn({ employeeId: currentUserId });
      }
      await fetchMonthData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل التسجيل السريع");
    }
  };

  // Get today's record for current user
  const today = new Date().toISOString().split("T")[0];
  const todayRecord = currentUserId
    ? records.find((r) => r.date === today && r.employeeId === currentUserId)
    : undefined;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Quick Check-in Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <IconClock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {new Date().toLocaleDateString("ar-SA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-muted-foreground">
                  {todayRecord?.checkInTime
                    ? `تسجيل الحضور: ${formatDateTime(todayRecord.checkInTime)}`
                    : "لم تسجل حضورك بعد"}
                  {todayRecord?.checkOutTime &&
                    ` | الانصراف: ${formatDateTime(todayRecord.checkOutTime)}`}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleQuickCheckIn}
              variant={todayRecord?.checkOutTime ? "outline" : "default"}
              disabled={!!todayRecord?.checkOutTime}
            >
              {!todayRecord?.checkInTime ? (
                <>
                  <IconLogin className="ms-2 h-5 w-5" />
                  تسجيل الحضور
                </>
              ) : !todayRecord?.checkOutTime ? (
                <>
                  <IconLogout className="ms-2 h-5 w-5" />
                  تسجيل الانصراف
                </>
              ) : (
                <>
                  <IconCheck className="ms-2 h-5 w-5" />
                  تم التسجيل
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أيام العمل</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkDays}</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حضور</CardTitle>
            <IconCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">يوم</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تأخير</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">يوم</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">غياب</CardTitle>
            <IconX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">يوم</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط العمل</CardTitle>
            <IconClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgWorkHours}</div>
            <p className="text-xs text-muted-foreground">ساعة/يوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center">{currentMonth}</span>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <IconChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={employeeFilter}
            onValueChange={(value) => setEmployeeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الموظف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الموظفين</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {getEmployeeFullName(emp.id)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as AttendanceStatus | "all")}
          >
            <SelectTrigger className="w-[150px]">
              <IconFilter className="h-4 w-4 ms-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {Object.entries(attendanceStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label.ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الحضور</CardTitle>
          <CardDescription>
            سجل الحضور والانصراف للشهر الحالي ({filteredRecords.length} سجل)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>الموظف</TableHead>
                <TableHead>الوردية</TableHead>
                <TableHead>الحضور</TableHead>
                <TableHead>الانصراف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التأخير</TableHead>
                <TableHead>ساعات العمل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6">
                    <TableSkeleton columns={8} rows={7} showHeader={false} />
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableEmptyRow
                  colSpan={8}
                  title="لا توجد سجلات"
                  description="عند تسجيل الحضور والانصراف سيظهر السجل هنا."
                  icon={<IconCalendar className="size-5" />}
                />
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString("ar-SA", {
                            weekday: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.date).toLocaleDateString("ar-SA", {
                            month: "short",
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getShiftName(record.shiftId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconLogin className="h-4 w-4 text-green-500" />
                        <span className="font-mono text-sm">
                          {formatDateTime(record.checkInTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        المتوقع: {formatTime(record.expectedCheckIn)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconLogout className="h-4 w-4 text-red-500" />
                        <span className="font-mono text-sm">
                          {formatDateTime(record.checkOutTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        المتوقع: {formatTime(record.expectedCheckOut)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>
                      {record.lateMinutes && record.lateMinutes > 0 ? (
                        <span className="text-yellow-600 font-medium">
                          {formatMinutesToHours(record.lateMinutes)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.totalWorkMinutes ? (
                        <span className="font-medium">
                          {formatMinutesToHours(record.totalWorkMinutes)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
