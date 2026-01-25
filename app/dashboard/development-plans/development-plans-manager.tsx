"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTarget,
  IconProgress,
  IconCheck,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DevelopmentPlan,
  DevelopmentPlanStatus,
  developmentPlanStatusLabels,
  developmentPlanStatusColors,
  activityTypeLabels,
} from "@/lib/types/training";

// بيانات وهمية
const mockDevelopmentPlans: DevelopmentPlan[] = [
  {
    id: "plan-1",
    employeeId: "emp-1",
    employeeName: "أحمد محمد",
    title: "خطة التطوير للترقية إلى مدير فريق",
    description: "خطة شاملة لتطوير المهارات القيادية والإدارية",
    status: "active",
    startDate: "2024-01-01",
    targetDate: "2024-06-30",
    goals: [
      {
        id: "goal-1",
        title: "تطوير مهارات القيادة",
        description: "اكتساب مهارات قيادة الفريق وإدارة الأفراد",
        targetDate: "2024-03-31",
        status: "in-progress",
        progress: 60,
      },
      {
        id: "goal-2",
        title: "تحسين مهارات التواصل",
        description: "تطوير مهارات التواصل الفعّال مع الفريق",
        targetDate: "2024-04-30",
        status: "not-started",
        progress: 0,
      },
    ],
    activities: [
      {
        id: "act-1",
        title: "دورة القيادة الفعّالة",
        type: "course",
        courseId: "course-1",
        dueDate: "2024-02-28",
        status: "completed",
        completedDate: "2024-02-15",
      },
      {
        id: "act-2",
        title: "قراءة كتاب القيادة للمبتدئين",
        type: "reading",
        dueDate: "2024-03-15",
        status: "in-progress",
      },
      {
        id: "act-3",
        title: "مشروع قيادة فريق صغير",
        type: "project",
        dueDate: "2024-04-30",
        status: "pending",
      },
    ],
    mentor: {
      id: "emp-m1",
      name: "محمد علي",
      role: "مدير القسم",
      email: "m.ali@company.com",
    },
    progress: 45,
    createdBy: "admin",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "plan-2",
    employeeId: "emp-2",
    employeeName: "سارة علي",
    title: "خطة التطوير في تحليل البيانات",
    status: "active",
    startDate: "2024-02-01",
    targetDate: "2024-08-31",
    goals: [
      {
        id: "goal-3",
        title: "إتقان Python للتحليل",
        targetDate: "2024-04-30",
        status: "in-progress",
        progress: 40,
      },
    ],
    activities: [
      {
        id: "act-4",
        title: "دورة Python للمحللين",
        type: "course",
        dueDate: "2024-03-31",
        status: "in-progress",
      },
    ],
    progress: 30,
    createdBy: "admin",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
  },
];

export function DevelopmentPlansManager() {
  const [plans, setPlans] = React.useState<DevelopmentPlan[]>(mockDevelopmentPlans);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedPlan, setSelectedPlan] = React.useState<DevelopmentPlan | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);

  // فلترة الخطط
  const filteredPlans = React.useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        plan.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || plan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [plans, searchQuery, statusFilter]);

  // إحصائيات
  const stats = React.useMemo(() => ({
    total: plans.length,
    active: plans.filter((p) => p.status === "active").length,
    completed: plans.filter((p) => p.status === "completed").length,
    avgProgress: Math.round(plans.reduce((sum, p) => sum + p.progress, 0) / plans.length),
  }), [plans]);

  const handleViewPlan = (plan: DevelopmentPlan) => {
    setSelectedPlan(plan);
    setIsViewSheetOpen(true);
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "skipped":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخطط</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">خطة تطوير</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">خطط نشطة</CardTitle>
            <IconProgress className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">خطة مكتملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقدم</CardTitle>
            <IconTarget className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">للخطط النشطة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول الخطط */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>خطط التطوير الوظيفي</CardTitle>
              <CardDescription>إدارة خطط تطوير الموظفين</CardDescription>
            </div>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <IconPlus className="ms-2 h-4 w-4" />
                  خطة جديدة
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>إنشاء خطة تطوير جديدة</SheetTitle>
                  <SheetDescription>
                    أدخل تفاصيل خطة التطوير الوظيفي
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>الموظف</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموظف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp-1">أحمد محمد</SelectItem>
                        <SelectItem value="emp-2">سارة علي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>عنوان الخطة</Label>
                    <Input placeholder="مثال: خطة التطوير للترقية" />
                  </div>
                  <div className="grid gap-2">
                    <Label>الوصف</Label>
                    <Textarea placeholder="وصف مختصر للخطة..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>تاريخ البدء</Label>
                      <Input type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label>التاريخ المستهدف</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>المرشد (اختياري)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المرشد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp-m1">محمد علي - مدير القسم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-4" onClick={() => setIsAddSheetOpen(false)}>
                    إنشاء الخطة
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          {/* أدوات البحث والفلترة */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="relative flex-1">
              <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(developmentPlanStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* جدول الخطط */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>عنوان الخطة</TableHead>
                  <TableHead>التاريخ المستهدف</TableHead>
                  <TableHead>التقدم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">لا توجد خطط</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={plan.employeeAvatar} />
                            <AvatarFallback>
                              {plan.employeeName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{plan.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{plan.title}</TableCell>
                      <TableCell>
                        {new Date(plan.targetDate).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-24">
                          <Progress value={plan.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {plan.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={developmentPlanStatusColors[plan.status]}>
                          {developmentPlanStatusLabels[plan.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPlan(plan)}>
                              <IconEye className="ms-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconEdit className="ms-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sheet عرض التفاصيل */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedPlan?.title}</SheetTitle>
            <SheetDescription>تفاصيل خطة التطوير</SheetDescription>
          </SheetHeader>
          {selectedPlan && (
            <div className="space-y-6 py-4">
              {/* معلومات الموظف */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedPlan.employeeName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedPlan.employeeName}</h3>
                  <Badge className={developmentPlanStatusColors[selectedPlan.status]}>
                    {developmentPlanStatusLabels[selectedPlan.status]}
                  </Badge>
                </div>
              </div>

              {/* التقدم */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>التقدم الكلي</span>
                  <span>{selectedPlan.progress}%</span>
                </div>
                <Progress value={selectedPlan.progress} className="h-3" />
              </div>

              {/* التواريخ */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">تاريخ البدء</p>
                  <p className="font-medium">
                    {new Date(selectedPlan.startDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">التاريخ المستهدف</p>
                  <p className="font-medium">
                    {new Date(selectedPlan.targetDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>

              {/* المرشد */}
              {selectedPlan.mentor && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">المرشد</h4>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {selectedPlan.mentor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPlan.mentor.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPlan.mentor.role}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* الأهداف */}
              <div>
                <h4 className="font-semibold mb-3">الأهداف</h4>
                <div className="space-y-3">
                  {selectedPlan.goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{goal.title}</p>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {goal.status === "completed" ? "مكتمل" : goal.status === "in-progress" ? "قيد التنفيذ" : "لم يبدأ"}
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        الموعد: {new Date(goal.targetDate).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* الأنشطة */}
              <div>
                <h4 className="font-semibold mb-3">الأنشطة</h4>
                <div className="space-y-2">
                  {selectedPlan.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                    >
                      <Checkbox checked={activity.status === "completed"} disabled />
                      <div className="flex-1">
                        <p className={`text-sm ${activity.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {activity.title}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activityTypeLabels[activity.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.dueDate).toLocaleDateString("ar-SA")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
