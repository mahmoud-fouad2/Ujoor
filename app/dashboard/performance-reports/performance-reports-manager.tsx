"use client";

import { useState, useEffect } from "react";
import {
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconDownload,
  IconFilter,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconTarget,
  IconStarFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  defaultPerformanceRatings,
  formatScore,
  getRatingByScore,
} from "@/lib/types/performance";

type EvaluationCycle = {
  id: string;
  name: string;
  status: string;
  totalEvaluations: number;
  completedEvaluations: number;
};

type EmployeeEvaluation = {
  id: string;
  employeeName: string;
  employeeNumber: string;
  employeeAvatar?: string;
  department: string;
  jobTitle: string;
  cycleName?: string;
  status: string;
  overallScore?: number;
};

type PerformanceGoal = {
  id: string;
  employeeName: string;
  title: string;
  status: string;
  progress: number;
};

// Mock department performance data
const departmentPerformance = [
  { department: "تقنية المعلومات", avgScore: 4.2, employees: 15, goalsCompleted: 85, trend: "up" },
  { department: "الموارد البشرية", avgScore: 4.0, employees: 8, goalsCompleted: 78, trend: "stable" },
  { department: "المالية", avgScore: 3.8, employees: 10, goalsCompleted: 72, trend: "down" },
  { department: "المبيعات", avgScore: 4.5, employees: 20, goalsCompleted: 92, trend: "up" },
  { department: "التسويق", avgScore: 4.1, employees: 12, goalsCompleted: 80, trend: "up" },
];

// Mock top performers
const topPerformers = [
  { name: "أحمد محمد", position: "مطور أول", department: "تقنية المعلومات", score: 4.8, avatar: "" },
  { name: "فاطمة علي", position: "مدير مبيعات", department: "المبيعات", score: 4.7, avatar: "" },
  { name: "خالد عبدالله", position: "محلل مالي", department: "المالية", score: 4.6, avatar: "" },
  { name: "نورة سعد", position: "مصممة UI/UX", department: "التسويق", score: 4.5, avatar: "" },
  { name: "محمد أحمد", position: "مهندس DevOps", department: "تقنية المعلومات", score: 4.5, avatar: "" },
];

// Mock rating distribution
const ratingDistribution = [
  { rating: "متميز", count: 15, percentage: 23 },
  { rating: "ممتاز", count: 25, percentage: 38 },
  { rating: "جيد جداً", count: 18, percentage: 28 },
  { rating: "جيد", count: 5, percentage: 8 },
  { rating: "يحتاج تحسين", count: 2, percentage: 3 },
];

export function PerformanceReportsManager() {
  const [selectedCycle, setSelectedCycle] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current_year");
  
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [evaluations, setEvaluations] = useState<EmployeeEvaluation[]>([]);
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [cyclesRes, evaluationsRes, goalsRes] = await Promise.all([
        fetch("/api/performance/cycles"),
        fetch("/api/performance/evaluations"),
        fetch("/api/performance/goals"),
      ]);

      if (cyclesRes.ok) {
        const cyclesData = await cyclesRes.json();
        setCycles(cyclesData.data || []);
      }

      if (evaluationsRes.ok) {
        const evaluationsData = await evaluationsRes.json();
        setEvaluations(evaluationsData.data || []);
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData.data || []);
      }
    } catch (error) {
      console.error("Failed to load performance data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate stats
  const completedEvaluations = evaluations.filter(
    (e) => e.status === "completed" && e.overallScore
  );
  const avgScore =
    completedEvaluations.length > 0
      ? completedEvaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
        completedEvaluations.length
      : 0;

  const completedGoals = goals.filter((g) => g.status === "completed");
  const goalsCompletionRate = goals.length > 0
    ? (completedGoals.length / goals.length) * 100
    : 0;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <IconTrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <IconTrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <IconMinus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRatingLabel = (score: number) => {
    const rating = getRatingByScore(score, defaultPerformanceRatings);
    return rating?.label || "غير محدد";
  };

  const getRatingColor = (score: number) => {
    const rating = getRatingByScore(score, defaultPerformanceRatings);
    return rating?.color || "gray";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تقارير الأداء</h2>
          <p className="text-muted-foreground">تحليلات وإحصائيات أداء الموظفين</p>
        </div>
        <Button variant="outline">
          <IconDownload className="ms-2 h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCycle} onValueChange={setSelectedCycle}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="دورة التقييم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الدورات</SelectItem>
            {cycles.map((cycle) => (
              <SelectItem key={cycle.id} value={cycle.id}>
                {cycle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            <SelectItem value="it">تقنية المعلومات</SelectItem>
            <SelectItem value="hr">الموارد البشرية</SelectItem>
            <SelectItem value="finance">المالية</SelectItem>
            <SelectItem value="sales">المبيعات</SelectItem>
            <SelectItem value="marketing">التسويق</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الفترة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_year">السنة الحالية</SelectItem>
            <SelectItem value="last_year">السنة الماضية</SelectItem>
            <SelectItem value="last_quarter">الربع الأخير</SelectItem>
            <SelectItem value="last_6_months">آخر 6 أشهر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4" />
                  إجمالي التقييمات المكتملة
                </CardDescription>
                <CardTitle className="text-3xl">{completedEvaluations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  من أصل {evaluations.length} تقييم
                </p>
              </CardContent>
            </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconStarFilled className="h-4 w-4" />
              متوسط التقييم
            </CardDescription>
            <CardTitle className="text-3xl">{formatScore(avgScore)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              style={{
                backgroundColor: `${getRatingColor(avgScore)}20`,
                color: getRatingColor(avgScore),
              }}
            >
              {getRatingLabel(avgScore)}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTarget className="h-4 w-4" />
              نسبة تحقيق الأهداف
            </CardDescription>
            <CardTitle className="text-3xl">{Math.round(goalsCompletionRate)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={goalsCompletionRate} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconBuilding className="h-4 w-4" />
              أفضل قسم
            </CardDescription>
            <CardTitle className="text-xl">المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">4.5</Badge>
              <IconTrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="departments">الأقسام</TabsTrigger>
          <TabsTrigger value="top-performers">المتميزون</TabsTrigger>
          <TabsTrigger value="distribution">توزيع التقييمات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Rating Distribution Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconChartPie className="h-4 w-4" />
                  توزيع التقييمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingDistribution.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.rating}</span>
                        <span className="font-medium">{item.count} ({item.percentage}%)</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconTarget className="h-4 w-4" />
                  تقدم الأهداف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "أهداف مكتملة", value: completedGoals.length, total: goals.length, color: "bg-green-500" },
                    { label: "قيد التنفيذ", value: goals.filter(g => g.status === "in-progress").length, total: goals.length, color: "bg-blue-500" },
                    { label: "متأخرة", value: goals.filter(g => g.status === "overdue").length, total: goals.length, color: "bg-red-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}</span>
                        <span className="text-muted-foreground text-sm">
                          ({Math.round((item.value / item.total) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Evaluations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  آخر التقييمات المكتملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>الدورة</TableHead>
                      <TableHead>التقييم النهائي</TableHead>
                      <TableHead>المستوى</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedEvaluations.slice(0, 5).map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={evaluation.employeeAvatar} />
                              <AvatarFallback>
                                {evaluation.employeeName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{evaluation.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.cycleName || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatScore(evaluation.overallScore || 0)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: `${getRatingColor(evaluation.overallScore || 0)}20`,
                              color: getRatingColor(evaluation.overallScore || 0),
                            }}
                          >
                            {getRatingLabel(evaluation.overallScore || 0)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">أداء الأقسام</CardTitle>
              <CardDescription>مقارنة أداء الأقسام المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القسم</TableHead>
                    <TableHead>عدد الموظفين</TableHead>
                    <TableHead>متوسط التقييم</TableHead>
                    <TableHead>نسبة تحقيق الأهداف</TableHead>
                    <TableHead>الاتجاه</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentPerformance.map((dept, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>{dept.employees}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: `${getRatingColor(dept.avgScore)}20`,
                              color: getRatingColor(dept.avgScore),
                            }}
                          >
                            {formatScore(dept.avgScore)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {getRatingLabel(dept.avgScore)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.goalsCompleted} className="w-20 h-2" />
                          <span className="text-sm">{dept.goalsCompleted}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTrendIcon(dept.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Performers Tab */}
        <TabsContent value="top-performers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الموظفون المتميزون</CardTitle>
              <CardDescription>أعلى 10 موظفين أداءً</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>{performer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {performer.position} - {performer.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <IconStarFilled
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(performer.score)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge
                        className="text-lg px-3"
                        style={{
                          backgroundColor: `${getRatingColor(performer.score)}20`,
                          color: getRatingColor(performer.score),
                        }}
                      >
                        {formatScore(performer.score)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">توزيع التقييمات</CardTitle>
                <CardDescription>توزيع الموظفين حسب مستوى التقييم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {defaultPerformanceRatings.map((rating, index) => {
                    const count = completedEvaluations.filter(
                      (e) =>
                        e.overallScore &&
                        e.overallScore >= rating.minScore &&
                        e.overallScore <= rating.maxScore
                    ).length;
                    const percentage =
                      completedEvaluations.length > 0
                        ? (count / completedEvaluations.length) * 100
                        : 0;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: rating.color }}
                            />
                            <span className="font-medium">{rating.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {count} موظف
                            </span>
                            <Badge variant="outline">{Math.round(percentage)}%</Badge>
                          </div>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-3"
                          style={
                            {
                              "--progress-background": rating.color,
                            } as React.CSSProperties
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          النطاق: {rating.minScore} - {rating.maxScore}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>أعلى تقييم</span>
                    <Badge className="bg-green-100 text-green-700">
                      {formatScore(
                        Math.max(
                          ...completedEvaluations.map((e) => e.overallScore || 0)
                        )
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>أقل تقييم</span>
                    <Badge className="bg-red-100 text-red-700">
                      {formatScore(
                        Math.min(
                          ...completedEvaluations.map((e) => e.overallScore || 0)
                        )
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>المتوسط</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {formatScore(avgScore)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>الانحراف المعياري</span>
                    <Badge variant="outline">0.45</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>موظفون فوق المتوسط</span>
                    <Badge className="bg-green-100 text-green-700">
                      {
                        completedEvaluations.filter(
                          (e) => (e.overallScore || 0) >= avgScore
                        ).length
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span>موظفون دون المتوسط</span>
                    <Badge className="bg-orange-100 text-orange-700">
                      {
                        completedEvaluations.filter(
                          (e) => (e.overallScore || 0) < avgScore
                        ).length
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  );
}
