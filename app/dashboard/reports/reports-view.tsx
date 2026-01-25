"use client";

import * as React from "react";
import {
  IconDownload,
  IconFilter,
  IconCalendar,
  IconUsers,
  IconClock,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  mockAttendanceRecords,
  mockShifts,
  formatMinutesToHours,
} from "@/lib/types/attendance";
import { mockEmployees, mockDepartments, getEmployeeFullName } from "@/lib/types/core-hr";

export function ReportsView() {
  const [reportType, setReportType] = React.useState<"summary" | "department" | "individual">(
    "summary"
  );
  const [selectedMonth, setSelectedMonth] = React.useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("all");

  // Parse selected month
  const [year, month] = selectedMonth.split("-").map(Number);

  // Filter records for selected month
  const monthRecords = mockAttendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate.getMonth() === month - 1 && recordDate.getFullYear() === year;
  });

  // Calculate summary stats
  const totalWorkDays = monthRecords.filter(
    (r) => !["weekend", "holiday"].includes(r.status)
  ).length;
  const totalPresent = monthRecords.filter((r) => r.status === "present").length;
  const totalLate = monthRecords.filter((r) => r.status === "late").length;
  const totalAbsent = monthRecords.filter((r) => r.status === "absent").length;
  const totalLateMinutes = monthRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);
  const totalWorkMinutes = monthRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);
  
  const attendanceRate = totalWorkDays > 0 
    ? Math.round(((totalPresent + totalLate) / totalWorkDays) * 100) 
    : 0;
  const punctualityRate = (totalPresent + totalLate) > 0
    ? Math.round((totalPresent / (totalPresent + totalLate)) * 100)
    : 0;

  // Calculate per-employee stats
  const employeeStats = mockEmployees.map((emp) => {
    const empRecords = monthRecords.filter((r) => r.employeeId === emp.id);
    const workDays = empRecords.filter((r) => !["weekend", "holiday"].includes(r.status)).length;
    const present = empRecords.filter((r) => r.status === "present").length;
    const late = empRecords.filter((r) => r.status === "late").length;
    const absent = empRecords.filter((r) => r.status === "absent").length;
    const lateMinutes = empRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);
    const workMinutes = empRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);

    return {
      employee: emp,
      workDays,
      present,
      late,
      absent,
      lateMinutes,
      workMinutes,
      attendanceRate: workDays > 0 ? Math.round(((present + late) / workDays) * 100) : 0,
    };
  });

  // Calculate per-department stats
  const departmentStats = mockDepartments.map((dept) => {
    const deptEmployees = mockEmployees.filter((e) => e.departmentId === dept.id);
    const deptRecords = monthRecords.filter((r) =>
      deptEmployees.some((e) => e.id === r.employeeId)
    );
    const workDays = deptRecords.filter((r) => !["weekend", "holiday"].includes(r.status)).length;
    const present = deptRecords.filter((r) => r.status === "present").length;
    const late = deptRecords.filter((r) => r.status === "late").length;
    const absent = deptRecords.filter((r) => r.status === "absent").length;

    return {
      department: dept,
      employeeCount: deptEmployees.length,
      workDays,
      present,
      late,
      absent,
      attendanceRate: workDays > 0 ? Math.round(((present + late) / workDays) * 100) : 0,
    };
  });

  // Filter by department
  const filteredEmployeeStats =
    selectedDepartment === "all"
      ? employeeStats
      : employeeStats.filter((e) => e.employee.departmentId === selectedDepartment);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "الموظف",
      "أيام العمل",
      "حضور",
      "تأخير",
      "غياب",
      "إجمالي التأخير (دقيقة)",
      "نسبة الحضور",
    ];
    const rows = filteredEmployeeStats.map((s) => [
      getEmployeeFullName(s.employee, "ar"),
      s.workDays,
      s.present,
      s.late,
      s.absent,
      s.lateMinutes,
      `${s.attendanceRate}%`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_report_${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get months for select
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return {
      value: `${year}-${String(i + 1).padStart(2, "0")}`,
      label: date.toLocaleString("ar-SA", { month: "long", year: "numeric" }),
    };
  });

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة الحضور</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
            <Progress value={attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة الالتزام بالمواعيد</CardTitle>
            <IconClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{punctualityRate}%</div>
            <Progress value={punctualityRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التأخير</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatMinutesToHours(totalLateMinutes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalLate} يوم تأخير
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي ساعات العمل</CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(totalWorkMinutes / 60)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ساعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <IconCalendar className="h-4 w-4 ms-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <IconFilter className="h-4 w-4 ms-2" />
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأقسام</SelectItem>
              {mockDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={exportToCSV}>
          <IconDownload className="ms-2 h-4 w-4" />
          تصدير CSV
        </Button>
      </div>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الأقسام</CardTitle>
          <CardDescription>نسب الحضور حسب القسم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((stat) => (
              <div key={stat.department.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stat.department.nameAr}</span>
                    <Badge variant="outline">{stat.employeeCount} موظف</Badge>
                  </div>
                  <span className="font-bold">{stat.attendanceRate}%</span>
                </div>
                <Progress value={stat.attendanceRate} />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="text-green-600">حضور: {stat.present}</span>
                  <span className="text-yellow-600">تأخير: {stat.late}</span>
                  <span className="text-red-600">غياب: {stat.absent}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Report */}
      <Card>
        <CardHeader>
          <CardTitle>تقرير الموظفين</CardTitle>
          <CardDescription>
            تفاصيل الحضور لكل موظف ({filteredEmployeeStats.length} موظف)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>أيام العمل</TableHead>
                <TableHead>حضور</TableHead>
                <TableHead>تأخير</TableHead>
                <TableHead>غياب</TableHead>
                <TableHead>إجمالي التأخير</TableHead>
                <TableHead>ساعات العمل</TableHead>
                <TableHead>نسبة الحضور</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployeeStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <IconUsers className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد بيانات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployeeStats.map((stat) => {
                  const dept = mockDepartments.find(
                    (d) => d.id === stat.employee.departmentId
                  );
                  return (
                    <TableRow key={stat.employee.id}>
                      <TableCell className="font-medium">
                        {getEmployeeFullName(stat.employee, "ar")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept?.nameAr || "-"}</Badge>
                      </TableCell>
                      <TableCell>{stat.workDays}</TableCell>
                      <TableCell className="text-green-600">{stat.present}</TableCell>
                      <TableCell className="text-yellow-600">{stat.late}</TableCell>
                      <TableCell className="text-red-600">{stat.absent}</TableCell>
                      <TableCell>
                        {stat.lateMinutes > 0 ? (
                          <span className="text-yellow-600">
                            {formatMinutesToHours(stat.lateMinutes)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {stat.workMinutes > 0
                          ? `${Math.round(stat.workMinutes / 60)} ساعة`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stat.attendanceRate} className="w-16" />
                          <span
                            className={
                              stat.attendanceRate >= 90
                                ? "text-green-600"
                                : stat.attendanceRate >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }
                          >
                            {stat.attendanceRate}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
