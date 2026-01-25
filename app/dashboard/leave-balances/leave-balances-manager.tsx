"use client";

import { useState } from "react";
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconRefresh,
  IconPlus,
  IconMinus,
  IconAdjustments,
  IconCalendar,
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LeaveBalance,
  LeaveCategory,
  leaveCategoryLabels,
  mockLeaveBalances,
  mockLeaveTypes,
  getBalancePercentage,
  leaveTypeColors,
} from "@/lib/types/leave";
import { mockEmployees, mockDepartments } from "@/lib/types/core-hr";

export function LeaveBalancesManager() {
  const [balances, setBalances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterLeaveType, setFilterLeaveType] = useState<string>("all");
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: "add" as "add" | "subtract",
    days: 0,
    reason: "",
  });

  // Group balances by employee
  const employeeBalances = balances.reduce((acc, balance) => {
    if (!acc[balance.employeeId]) {
      acc[balance.employeeId] = {
        employeeId: balance.employeeId,
        employeeName: balance.employeeName,
        employeeNumber: balance.employeeNumber,
        departmentId: balance.departmentId,
        departmentName: balance.departmentName,
        balances: [],
      };
    }
    acc[balance.employeeId].balances.push(balance);
    return acc;
  }, {} as Record<string, { employeeId: string; employeeName: string; employeeNumber: string; departmentId: string; departmentName: string; balances: LeaveBalance[] }>);

  // Filter employees
  const filteredEmployees = Object.values(employeeBalances).filter((emp) => {
    const matchesSearch =
      emp.employeeName.includes(searchQuery) ||
      emp.employeeNumber.includes(searchQuery);
    const matchesDepartment =
      filterDepartment === "all" || emp.departmentId === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Calculate totals
  const calculateTotals = () => {
    let totalEntitled = 0;
    let totalTaken = 0;
    let totalPending = 0;
    let totalRemaining = 0;

    balances.forEach((b) => {
      totalEntitled += b.entitled + b.carriedOver;
      totalTaken += b.taken;
      totalPending += b.pending;
      totalRemaining += b.remaining;
    });

    return { totalEntitled, totalTaken, totalPending, totalRemaining };
  };

  const totals = calculateTotals();

  const handleAdjust = () => {
    if (!selectedBalance || adjustmentData.days <= 0 || !adjustmentData.reason) return;

    const adjustment = adjustmentData.type === "add" 
      ? adjustmentData.days 
      : -adjustmentData.days;

    setBalances(
      balances.map((b) =>
        b.id === selectedBalance.id
          ? {
              ...b,
              entitled: b.entitled + adjustment,
              remaining: b.remaining + adjustment,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    setIsAdjustDialogOpen(false);
    setSelectedBalance(null);
    setAdjustmentData({ type: "add", days: 0, reason: "" });
  };

  const openAdjustDialog = (balance: LeaveBalance) => {
    setSelectedBalance(balance);
    setAdjustmentData({ type: "add", days: 0, reason: "" });
    setIsAdjustDialogOpen(true);
  };

  // Stats for each leave type
  const leaveTypeStats = mockLeaveTypes.map((type) => {
    const typeBalances = balances.filter((b) => b.leaveTypeId === type.id);
    const totalEntitled = typeBalances.reduce((sum, b) => sum + b.entitled + b.carriedOver, 0);
    const totalTaken = typeBalances.reduce((sum, b) => sum + b.taken, 0);
    return {
      ...type,
      totalEntitled,
      totalTaken,
      usageRate: totalEntitled > 0 ? Math.round((totalTaken / totalEntitled) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">أرصدة الإجازات</h2>
          <p className="text-muted-foreground">متابعة أرصدة إجازات الموظفين</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <IconDownload className="ms-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي المستحق</CardDescription>
            <CardTitle className="text-3xl">{totals.totalEntitled}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">يوم لجميع الموظفين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي المأخوذ</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{totals.totalTaken}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(totals.totalTaken / totals.totalEntitled) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>قيد الانتظار</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{totals.totalPending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">يوم في طلبات معلقة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي المتبقي</CardDescription>
            <CardTitle className="text-3xl text-green-600">{totals.totalRemaining}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">يوم متاح للاستخدام</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Type Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>معدل استخدام أنواع الإجازات</CardTitle>
          <CardDescription>نظرة عامة على استخدام كل نوع إجازة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {leaveTypeStats.slice(0, 4).map((type) => (
              <div
                key={type.id}
                className="rounded-lg border p-4"
                style={{ borderColor: type.color }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="font-medium">{type.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المستخدم</span>
                    <span>{type.totalTaken} من {type.totalEntitled}</span>
                  </div>
                  <Progress
                    value={type.usageRate}
                    className="h-2"
                    style={{ 
                      backgroundColor: `${type.color}20`,
                    }}
                  />
                  <div className="text-start text-sm font-medium" style={{ color: type.color }}>
                    {type.usageRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Balances Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>أرصدة الموظفين</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو الرقم..."
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
                <TableHead className="text-center">المستحق</TableHead>
                <TableHead className="text-center">المرحل</TableHead>
                <TableHead className="text-center">المأخوذ</TableHead>
                <TableHead className="text-center">معلق</TableHead>
                <TableHead className="text-center">المتبقي</TableHead>
                <TableHead className="text-center">الاستخدام</TableHead>
                <TableHead className="w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد بيانات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.flatMap((emp) =>
                  emp.balances
                    .filter(
                      (b) => filterLeaveType === "all" || b.leaveTypeId === filterLeaveType
                    )
                    .map((balance, index) => (
                      <TableRow key={balance.id}>
                        {index === 0 ? (
                          <TableCell rowSpan={emp.balances.length}>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                  {emp.employeeName.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{emp.employeeName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {emp.departmentName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        ) : null}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  leaveTypeColors[balance.leaveCategory] || "#6B7280",
                              }}
                            />
                            {balance.leaveTypeName}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {balance.entitled}
                        </TableCell>
                        <TableCell className="text-center">
                          {balance.carriedOver > 0 ? (
                            <Badge variant="secondary">{balance.carriedOver}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-center text-orange-600">
                          {balance.taken}
                        </TableCell>
                        <TableCell className="text-center">
                          {balance.pending > 0 ? (
                            <Badge variant="outline" className="bg-yellow-50">
                              {balance.pending}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium text-green-600">
                          {balance.remaining}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={getBalancePercentage(balance)}
                              className="h-2 w-16"
                            />
                            <span className="text-sm text-muted-foreground">
                              {getBalancePercentage(balance)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAdjustDialog(balance)}
                          >
                            <IconAdjustments className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Adjust Balance Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل رصيد الإجازة</DialogTitle>
            <DialogDescription>
              تعديل رصيد {selectedBalance?.leaveTypeName} للموظف{" "}
              {selectedBalance?.employeeName}
            </DialogDescription>
          </DialogHeader>

          {selectedBalance && (
            <div className="space-y-4 py-4">
              {/* Current Balance Info */}
              <div className="rounded-lg bg-muted p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">المستحق</p>
                    <p className="text-xl font-bold">{selectedBalance.entitled}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المأخوذ</p>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedBalance.taken}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المتبقي</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedBalance.remaining}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>نوع التعديل</Label>
                <div className="flex gap-2">
                  <Button
                    variant={adjustmentData.type === "add" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() =>
                      setAdjustmentData({ ...adjustmentData, type: "add" })
                    }
                  >
                    <IconPlus className="ms-2 h-4 w-4" />
                    إضافة أيام
                  </Button>
                  <Button
                    variant={adjustmentData.type === "subtract" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() =>
                      setAdjustmentData({ ...adjustmentData, type: "subtract" })
                    }
                  >
                    <IconMinus className="ms-2 h-4 w-4" />
                    خصم أيام
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>عدد الأيام *</Label>
                <Input
                  type="number"
                  value={adjustmentData.days}
                  onChange={(e) =>
                    setAdjustmentData({
                      ...adjustmentData,
                      days: Number(e.target.value),
                    })
                  }
                  min={1}
                  max={adjustmentData.type === "subtract" ? selectedBalance.remaining : 365}
                />
              </div>

              <div className="space-y-2">
                <Label>سبب التعديل *</Label>
                <Textarea
                  value={adjustmentData.reason}
                  onChange={(e) =>
                    setAdjustmentData({ ...adjustmentData, reason: e.target.value })
                  }
                  placeholder="أدخل سبب تعديل الرصيد..."
                  rows={3}
                />
              </div>

              {/* Preview */}
              {adjustmentData.days > 0 && (
                <div className="rounded-lg border border-dashed p-4">
                  <p className="text-sm text-muted-foreground mb-2">معاينة التعديل:</p>
                  <div className="flex items-center justify-between">
                    <span>الرصيد الجديد:</span>
                    <Badge
                      variant="outline"
                      className={
                        adjustmentData.type === "add"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {adjustmentData.type === "add"
                        ? selectedBalance.remaining + adjustmentData.days
                        : selectedBalance.remaining - adjustmentData.days}{" "}
                      يوم
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleAdjust}
              disabled={adjustmentData.days <= 0 || !adjustmentData.reason}
            >
              حفظ التعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
