"use client";

import * as React from "react";
import {
  IconDownload,
  IconFilter,
  IconCalendar,
  IconCurrencyRiyal,
  IconUsers,
  IconBuilding,
  IconTrendingUp,
  IconChartBar,
  IconFileSpreadsheet,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  mockPayrollPeriods,
  getMonthName,
} from "@/lib/types/payroll";
import { mockDepartments } from "@/lib/types/core-hr";

// Mock report data
const generateDepartmentStats = () => {
  return mockDepartments.map((dept, index) => ({
    id: dept.id,
    name: dept.nameAr,
    employeeCount: 5 + index * 2,
    totalGross: 50000 + index * 20000,
    totalDeductions: 5000 + index * 2000,
    totalNet: 45000 + index * 18000,
    avgSalary: 10000 + index * 1000,
  }));
};

const generateMonthlyTrend = () => {
  return Array.from({ length: 6 }, (_, i) => {
    const month = 12 - i;
    const year = month > 0 ? 2024 : 2023;
    const actualMonth = month > 0 ? month : 12 + month;
    return {
      month: `${getMonthName(actualMonth)} ${year}`,
      totalGross: 480000 + Math.random() * 20000,
      totalNet: 430000 + Math.random() * 20000,
      employeeCount: 25 + Math.floor(Math.random() * 5),
    };
  }).reverse();
};

export function PayrollReportsView() {
  const [yearFilter, setYearFilter] = React.useState("2024");
  const [monthFilter, setMonthFilter] = React.useState("all");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");

  const departmentStats = generateDepartmentStats();
  const monthlyTrend = generateMonthlyTrend();

  // Calculate totals
  const totalStats = {
    totalGross: departmentStats.reduce((sum, d) => sum + d.totalGross, 0),
    totalDeductions: departmentStats.reduce((sum, d) => sum + d.totalDeductions, 0),
    totalNet: departmentStats.reduce((sum, d) => sum + d.totalNet, 0),
    totalEmployees: departmentStats.reduce((sum, d) => sum + d.employeeCount, 0),
    avgSalary: departmentStats.reduce((sum, d) => sum + d.avgSalary, 0) / departmentStats.length,
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ["القسم", "عدد الموظفين", "إجمالي الرواتب", "الخصومات", "الصافي", "متوسط الراتب"];
    const rows = departmentStats.map((d) => [
      d.name,
      d.employeeCount,
      d.totalGross,
      d.totalDeductions,
      d.totalNet,
      d.avgSalary,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payroll-report-${yearFilter}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرواتب</CardTitle>
            <IconCurrencyRiyal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(totalStats.totalGross)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الخصومات</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(totalStats.totalDeductions)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الرواتب</CardTitle>
            <IconCurrencyRiyal className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(totalStats.totalNet)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الموظفين</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الراتب</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(totalStats.avgSalary)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <IconCalendar className="h-4 w-4 ms-2" />
              <SelectValue placeholder="السنة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="الشهر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الشهور</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {getMonthName(i + 1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]">
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

        <Button variant="outline" onClick={handleExportCSV}>
          <IconDownload className="ms-2 h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">
            <IconBuilding className="h-4 w-4 ms-2" />
            حسب الأقسام
          </TabsTrigger>
          <TabsTrigger value="trend">
            <IconTrendingUp className="h-4 w-4 ms-2" />
            الاتجاه الشهري
          </TabsTrigger>
          <TabsTrigger value="gosi">
            <IconFileSpreadsheet className="h-4 w-4 ms-2" />
            تقرير التأمينات
          </TabsTrigger>
        </TabsList>

        {/* Department Stats */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>تقرير الرواتب حسب الأقسام</CardTitle>
              <CardDescription>تفصيل الرواتب والخصومات لكل قسم</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القسم</TableHead>
                    <TableHead>عدد الموظفين</TableHead>
                    <TableHead>إجمالي الرواتب</TableHead>
                    <TableHead>الخصومات</TableHead>
                    <TableHead>الصافي</TableHead>
                    <TableHead>متوسط الراتب</TableHead>
                    <TableHead>النسبة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStats.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.employeeCount}</TableCell>
                      <TableCell>{formatCurrency(dept.totalGross)}</TableCell>
                      <TableCell className="text-red-600">
                        -{formatCurrency(dept.totalDeductions)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(dept.totalNet)}
                      </TableCell>
                      <TableCell>{formatCurrency(dept.avgSalary)}</TableCell>
                      <TableCell className="w-32">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(dept.totalNet / totalStats.totalNet) * 100}
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground w-10">
                            {((dept.totalNet / totalStats.totalNet) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted">
                    <TableCell>الإجمالي</TableCell>
                    <TableCell>{totalStats.totalEmployees}</TableCell>
                    <TableCell>{formatCurrency(totalStats.totalGross)}</TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(totalStats.totalDeductions)}
                    </TableCell>
                    <TableCell>{formatCurrency(totalStats.totalNet)}</TableCell>
                    <TableCell>{formatCurrency(totalStats.avgSalary)}</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trend */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>الاتجاه الشهري للرواتب</CardTitle>
              <CardDescription>مقارنة الرواتب على مدار الأشهر</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الشهر</TableHead>
                    <TableHead>عدد الموظفين</TableHead>
                    <TableHead>إجمالي الرواتب</TableHead>
                    <TableHead>صافي الرواتب</TableHead>
                    <TableHead>التغيير</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTrend.map((month, index) => {
                    const prevMonth = index > 0 ? monthlyTrend[index - 1] : null;
                    const change = prevMonth
                      ? ((month.totalNet - prevMonth.totalNet) / prevMonth.totalNet) * 100
                      : 0;
                    return (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell>{month.employeeCount}</TableCell>
                        <TableCell>{formatCurrency(month.totalGross)}</TableCell>
                        <TableCell>{formatCurrency(month.totalNet)}</TableCell>
                        <TableCell>
                          {index > 0 && (
                            <span
                              className={
                                change > 0
                                  ? "text-green-600"
                                  : change < 0
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GOSI Report */}
        <TabsContent value="gosi">
          <Card>
            <CardHeader>
              <CardTitle>تقرير التأمينات الاجتماعية (GOSI)</CardTitle>
              <CardDescription>
                ملخص اشتراكات التأمينات الاجتماعية للموظفين وصاحب العمل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">حصة الموظفين (9.75%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalStats.totalGross * 0.0975 * 0.6)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">حصة صاحب العمل (11.75%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalStats.totalGross * 0.1175 * 0.6)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">إجمالي الاشتراكات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalStats.totalGross * 0.215 * 0.6)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القسم</TableHead>
                    <TableHead>الراتب الخاضع</TableHead>
                    <TableHead>حصة الموظف</TableHead>
                    <TableHead>حصة صاحب العمل</TableHead>
                    <TableHead>الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStats.map((dept) => {
                    const gosiBase = dept.totalGross * 0.6; // Assume 60% is GOSI applicable
                    const employeeShare = gosiBase * 0.0975;
                    const employerShare = gosiBase * 0.1175;
                    return (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{formatCurrency(gosiBase)}</TableCell>
                        <TableCell className="text-blue-600">
                          {formatCurrency(employeeShare)}
                        </TableCell>
                        <TableCell className="text-orange-600">
                          {formatCurrency(employerShare)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(employeeShare + employerShare)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button variant="outline">
                  <IconDownload className="ms-2 h-4 w-4" />
                  تصدير تقرير التأمينات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
