"use client";

import * as React from "react";
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconSend,
  IconEye,
  IconPrinter,
  IconMail,
  IconCurrencyRiyal,
  IconUser,
  IconBuilding,
  IconCalendar,
  IconFileInvoice,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Separator } from "@/components/ui/separator";
import {
  type Payslip,
  type PayslipStatus,
  formatCurrency,
  mockPayrollPeriods,
} from "@/lib/types/payroll";
import { mockEmployees, getEmployeeFullName } from "@/lib/types/core-hr";
import { mockDepartments } from "@/lib/types/core-hr";

// Generate mock payslips
const generateMockPayslips = (): Payslip[] => {
  return mockEmployees.slice(0, 10).map((emp, index) => {
    const dept = mockDepartments.find((d) => d.id === emp.departmentId);
    const basicSalary = emp.basicSalary || 8000 + index * 1000;
    const housingAllowance = basicSalary * 0.25;
    const transportAllowance = basicSalary * 0.1;
    const totalEarnings = basicSalary + housingAllowance + transportAllowance;
    const gosiEmployee = Math.round((basicSalary + housingAllowance) * 0.0975);
    const totalDeductions = gosiEmployee;
    const netSalary = totalEarnings - totalDeductions;

    return {
      id: `payslip-${emp.id}`,
      payrollPeriodId: "payroll-2024-02",
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      employeeNameAr: `${emp.firstNameAr || emp.firstName} ${emp.lastNameAr || emp.lastName}`,
      employeeNumber: emp.employeeNumber,
      department: dept?.name || "N/A",
      departmentAr: dept?.nameAr || "غير محدد",
      jobTitle: "Job Title", // From jobTitleId lookup in real implementation
      jobTitleAr: "المسمى الوظيفي", // From jobTitleId lookup in real implementation
      basicSalary,
      earnings: [
        { type: "basic", name: "Basic Salary", nameAr: "الراتب الأساسي", amount: basicSalary },
        { type: "housing", name: "Housing Allowance", nameAr: "بدل السكن", amount: housingAllowance },
        { type: "transport", name: "Transport Allowance", nameAr: "بدل المواصلات", amount: transportAllowance },
      ],
      totalEarnings,
      deductions: [
        { type: "gosi", name: "GOSI", nameAr: "التأمينات الاجتماعية", amount: gosiEmployee },
      ],
      totalDeductions,
      netSalary,
      workingDays: 22,
      actualWorkDays: 21,
      absentDays: 1,
      lateDays: 2,
      overtimeHours: index % 3 === 0 ? 8 : 0,
      gosiEmployee,
      gosiEmployer: Math.round((basicSalary + housingAllowance) * 0.1175),
      status: index < 3 ? "sent" : index < 6 ? "generated" : "draft",
      sentAt: index < 3 ? new Date().toISOString() : undefined,
      viewedAt: index < 2 ? new Date().toISOString() : undefined,
      paymentMethod: "bank_transfer",
      bankName: "البنك الأهلي السعودي",
      accountNumber: `SA${Math.random().toString().slice(2, 20)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Payslip;
  });
};

export function PayslipsManager() {
  const [payslips, setPayslips] = React.useState<Payslip[]>(generateMockPayslips);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [periodFilter, setPeriodFilter] = React.useState("payroll-2024-02");
  const [statusFilter, setStatusFilter] = React.useState<PayslipStatus | "all">("all");
  const [selectedPayslip, setSelectedPayslip] = React.useState<Payslip | null>(null);

  const filteredPayslips = payslips.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employeeNameAr.includes(searchQuery) ||
      p.employeeNumber.includes(searchQuery);
    const matchesPeriod = !periodFilter || p.payrollPeriodId === periodFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  const stats = {
    total: payslips.length,
    sent: payslips.filter((p) => p.status === "sent").length,
    viewed: payslips.filter((p) => p.status === "viewed").length,
    totalNet: payslips.reduce((sum, p) => sum + p.netSalary, 0),
  };

  const handleSendPayslip = (payslipId: string) => {
    setPayslips((prev) =>
      prev.map((p) =>
        p.id === payslipId
          ? { ...p, status: "sent" as PayslipStatus, sentAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleSendAll = () => {
    setPayslips((prev) =>
      prev.map((p) =>
        p.status === "generated" || p.status === "draft"
          ? { ...p, status: "sent" as PayslipStatus, sentAt: new Date().toISOString() }
          : p
      )
    );
  };

  const getStatusBadge = (status: PayslipStatus) => {
    const labels: Record<PayslipStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
      draft: { label: "مسودة", variant: "secondary" },
      generated: { label: "تم الإنشاء", variant: "outline" },
      sent: { label: "تم الإرسال", variant: "default" },
      viewed: { label: "تم الاطلاع", variant: "default" },
    };
    return <Badge variant={labels[status].variant}>{labels[status].label}</Badge>;
  };

  const currentPeriod = mockPayrollPeriods.find((p) => p.id === periodFilter);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القسائم</CardTitle>
            <IconFileInvoice className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم إرسالها</CardTitle>
            <IconMail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الاطلاع</CardTitle>
            <IconEye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.viewed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الصافي</CardTitle>
            <IconCurrencyRiyal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.totalNet)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو الرقم الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <IconCalendar className="h-4 w-4 ms-2" />
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              {mockPayrollPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as PayslipStatus | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <IconFilter className="h-4 w-4 ms-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="generated">تم الإنشاء</SelectItem>
              <SelectItem value="sent">تم الإرسال</SelectItem>
              <SelectItem value="viewed">تم الاطلاع</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSendAll}>
            <IconSend className="ms-2 h-4 w-4" />
            إرسال الكل
          </Button>
          <Button variant="outline">
            <IconDownload className="ms-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Current Period Info */}
      {currentPeriod && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الفترة الحالية</p>
                <p className="font-semibold">{currentPeriod.nameAr}</p>
              </div>
              <div className="text-start">
                <p className="text-sm text-muted-foreground">تاريخ الصرف</p>
                <p className="font-semibold">{currentPeriod.paymentDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle>قسائم الرواتب</CardTitle>
          <CardDescription>قائمة بجميع قسائم الرواتب للفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الخصومات</TableHead>
                <TableHead>الصافي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-start">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayslips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <IconFileInvoice className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد قسائم</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <IconUser className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{payslip.employeeNameAr}</p>
                          <p className="text-xs text-muted-foreground">
                            {payslip.employeeNumber}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        <span>{payslip.departmentAr}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(payslip.totalEarnings)}</TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(payslip.totalDeductions)}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(payslip.netSalary)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPayslip(payslip)}
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <IconDownload className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <IconPrinter className="h-4 w-4" />
                        </Button>
                        {payslip.status !== "sent" && payslip.status !== "viewed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendPayslip(payslip.id)}
                          >
                            <IconSend className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payslip Preview Dialog */}
      <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>قسيمة الراتب</DialogTitle>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6 p-4 border rounded-lg">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold">قسيمة راتب</h2>
                <p className="text-muted-foreground">{currentPeriod?.nameAr}</p>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">اسم الموظف</p>
                  <p className="font-medium">{selectedPayslip.employeeNameAr}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الرقم الوظيفي</p>
                  <p className="font-medium">{selectedPayslip.employeeNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">القسم</p>
                  <p className="font-medium">{selectedPayslip.departmentAr}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المسمى الوظيفي</p>
                  <p className="font-medium">{selectedPayslip.jobTitleAr}</p>
                </div>
              </div>

              <Separator />

              {/* Earnings */}
              <div>
                <h3 className="font-semibold mb-2">الاستحقاقات</h3>
                <Table>
                  <TableBody>
                    {selectedPayslip.earnings.map((earning, index) => (
                      <TableRow key={index}>
                        <TableCell>{earning.nameAr}</TableCell>
                        <TableCell className="text-start">
                          {formatCurrency(earning.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted">
                      <TableCell>إجمالي الاستحقاقات</TableCell>
                      <TableCell className="text-start">
                        {formatCurrency(selectedPayslip.totalEarnings)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold mb-2">الخصومات</h3>
                <Table>
                  <TableBody>
                    {selectedPayslip.deductions.map((deduction, index) => (
                      <TableRow key={index}>
                        <TableCell>{deduction.nameAr}</TableCell>
                        <TableCell className="text-start text-red-600">
                          -{formatCurrency(deduction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted">
                      <TableCell>إجمالي الخصومات</TableCell>
                      <TableCell className="text-start text-red-600">
                        -{formatCurrency(selectedPayslip.totalDeductions)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Net Salary */}
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-lg font-bold">صافي الراتب</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(selectedPayslip.netSalary)}
                </span>
              </div>

              {/* Attendance Summary */}
              <div className="grid grid-cols-4 gap-4 text-center text-sm">
                <div className="p-2 bg-muted rounded">
                  <p className="text-muted-foreground">أيام العمل</p>
                  <p className="font-bold">{selectedPayslip.workingDays}</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-muted-foreground">أيام الحضور</p>
                  <p className="font-bold">{selectedPayslip.actualWorkDays}</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-muted-foreground">أيام الغياب</p>
                  <p className="font-bold text-red-600">{selectedPayslip.absentDays}</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-muted-foreground">ساعات إضافية</p>
                  <p className="font-bold text-blue-600">{selectedPayslip.overtimeHours}</p>
                </div>
              </div>

              {/* Bank Info */}
              <div className="text-sm text-muted-foreground">
                <p>طريقة الدفع: تحويل بنكي</p>
                <p>البنك: {selectedPayslip.bankName}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <IconPrinter className="ms-2 h-4 w-4" />
                  طباعة
                </Button>
                <Button variant="outline">
                  <IconDownload className="ms-2 h-4 w-4" />
                  تحميل PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
