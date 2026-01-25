'use client';

import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Users, Clock, Wallet,
  Target, GraduationCap, Briefcase, Building2, BarChart3,
  PieChart, LineChart, ArrowUpRight, Calendar, Download, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockKPIs,
  mockHRAnalytics,
  mockAttendanceAnalytics,
  mockPayrollAnalytics,
  type KPIMetric,
} from '@/lib/types/reports';

export default function AnalyticsManager() {
  const [period, setPeriod] = useState('current-month');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === 'up') return isPositive ? 'text-green-600' : 'text-red-600';
    if (trend === 'down') return isPositive ? 'text-red-600' : 'text-green-600';
    return 'text-gray-600';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">التحليلات</h1>
          <p className="text-muted-foreground">لوحة تحكم تحليلية شاملة</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 ms-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">هذا الأسبوع</SelectItem>
              <SelectItem value="current-month">الشهر الحالي</SelectItem>
              <SelectItem value="last-month">الشهر السابق</SelectItem>
              <SelectItem value="this-quarter">هذا الربع</SelectItem>
              <SelectItem value="this-year">هذه السنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 ms-2" />
            تحديث
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ms-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {mockKPIs.map((kpi) => (
          <Card key={kpi.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{kpi.name}</span>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {kpi.unit === 'ر.س' ? formatCurrency(kpi.value) : 
                   kpi.unit ? `${kpi.value}${kpi.unit}` : formatNumber(kpi.value)}
                </span>
              </div>
              {kpi.trendPercentage !== undefined && (
                <p className={`text-xs mt-1 ${getTrendColor(kpi.trend, kpi.id !== 'kpi-2')}`}>
                  {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage}% عن الفترة السابقة
                </p>
              )}
              {kpi.target && (
                <div className="mt-2">
                  <Progress value={(kpi.value / kpi.target) * 100} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    الهدف: {kpi.target}{kpi.unit}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="hr" className="w-full">
        <TabsList>
          <TabsTrigger value="hr">الموارد البشرية</TabsTrigger>
          <TabsTrigger value="attendance">الحضور</TabsTrigger>
          <TabsTrigger value="payroll">الرواتب</TabsTrigger>
        </TabsList>

        {/* HR Analytics Tab */}
        <TabsContent value="hr" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الموظفين</p>
                    <p className="text-2xl font-bold">{formatNumber(mockHRAnalytics.totalEmployees)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تعيينات جديدة</p>
                    <p className="text-2xl font-bold">{mockHRAnalytics.newHires}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">مغادرون</p>
                    <p className="text-2xl font-bold">{mockHRAnalytics.terminations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">معدل الدوران</p>
                    <p className="text-2xl font-bold">{mockHRAnalytics.turnoverRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  توزيع الموظفين حسب القسم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHRAnalytics.headcountByDepartment.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.department}</span>
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                        </div>
                        <Progress value={(item.count / mockHRAnalytics.totalEmployees) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  توزيع الجنسيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHRAnalytics.headcountByNationality.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full bg-blue-${(index + 3) * 100}`} 
                             style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                        <span className="text-sm">{item.nationality}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({((item.count / mockHRAnalytics.totalEmployees) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  التوزيع العمري
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHRAnalytics.ageDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm w-16">{item.range}</span>
                      <div className="flex-1">
                        <Progress value={(item.count / mockHRAnalytics.totalEmployees) * 100} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-start">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  نوع التوظيف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHRAnalytics.employmentTypeDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">{item.type}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Analytics Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">معدل الحضور</p>
                    <p className="text-2xl font-bold">{mockAttendanceAnalytics.averageAttendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تأخيرات</p>
                    <p className="text-2xl font-bold">{mockAttendanceAnalytics.lateArrivals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">غياب</p>
                    <p className="text-2xl font-bold">{mockAttendanceAnalytics.absences}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ساعات إضافية</p>
                    <p className="text-2xl font-bold">{mockAttendanceAnalytics.overtimeHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                معدل الحضور حسب القسم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAttendanceAnalytics.attendanceByDepartment.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm w-32">{item.department}</span>
                    <div className="flex-1">
                      <Progress value={item.rate} className="h-3" />
                    </div>
                    <span className={`text-sm font-medium w-16 text-start ${
                      item.rate >= 95 ? 'text-green-600' : 
                      item.rate >= 90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Analytics Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الرواتب</p>
                    <p className="text-2xl font-bold">{formatCurrency(mockPayrollAnalytics.totalPayroll)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">متوسط الراتب</p>
                    <p className="text-2xl font-bold">{formatCurrency(mockPayrollAnalytics.averageSalary)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  الرواتب حسب القسم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayrollAnalytics.salaryByDepartment.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <span className="font-medium">{item.department}</span>
                        <p className="text-xs text-muted-foreground">
                          متوسط: {formatCurrency(item.average)}
                        </p>
                      </div>
                      <span className="font-bold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  توزيع البدلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayrollAnalytics.allowancesBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.type}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex items-center justify-between font-bold">
                    <span>الإجمالي</span>
                    <span>{formatCurrency(
                      mockPayrollAnalytics.allowancesBreakdown.reduce((sum, item) => sum + item.amount, 0)
                    )}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
