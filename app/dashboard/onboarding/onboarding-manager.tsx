"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconUser,
  IconCalendar,
  IconCheck,
  IconProgress,
  IconAlertCircle,
  IconClipboardList,
  IconMail,
  IconUsers,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  OnboardingProcess,
  OnboardingStatus,
  OnboardingTask,
  onboardingStatusLabels,
  onboardingStatusColors,
  taskCategoryLabels,
  taskStatusLabels,
} from "@/lib/types/recruitment";

// بيانات وهمية للإلحاق
const mockOnboardingProcesses: OnboardingProcess[] = [
  {
    id: "onb-1",
    employeeId: "emp-new-1",
    employeeName: "أحمد محمد",
    jobTitle: "مطور برمجيات أول",
    departmentName: "تقنية المعلومات",
    startDate: "2024-02-01",
    mentor: {
      id: "emp-1",
      name: "محمد أحمد",
      role: "مدير تقني",
      email: "mohammed@company.com",
    },
    status: "in-progress",
    progress: 65,
    tasks: [
      {
        id: "task-1",
        title: "استكمال المستندات الرسمية",
        category: "documentation",
        dueDate: "2024-02-01",
        completedDate: "2024-02-01",
        status: "completed",
        priority: "high",
      },
      {
        id: "task-2",
        title: "إعداد حساب البريد الإلكتروني",
        category: "system-access",
        dueDate: "2024-02-01",
        completedDate: "2024-02-01",
        status: "completed",
        priority: "high",
      },
      {
        id: "task-3",
        title: "تدريب على أنظمة الشركة",
        category: "training",
        dueDate: "2024-02-05",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "task-4",
        title: "جلسة تعريفية مع الفريق",
        category: "introduction",
        dueDate: "2024-02-03",
        status: "pending",
        priority: "medium",
      },
    ],
    documents: [],
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-02-02T10:00:00Z",
  },
  {
    id: "onb-2",
    employeeId: "emp-new-2",
    employeeName: "سارة علي",
    jobTitle: "محللة بيانات",
    departmentName: "تحليل البيانات",
    startDate: "2024-02-05",
    status: "not-started",
    progress: 0,
    tasks: [
      {
        id: "task-5",
        title: "استكمال المستندات الرسمية",
        category: "documentation",
        dueDate: "2024-02-05",
        status: "pending",
        priority: "high",
      },
    ],
    documents: [],
    createdAt: "2024-01-28T10:00:00Z",
    updatedAt: "2024-01-28T10:00:00Z",
  },
];

export function OnboardingManager() {
  const [processes, setProcesses] = React.useState<OnboardingProcess[]>(mockOnboardingProcesses);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedProcess, setSelectedProcess] = React.useState<OnboardingProcess | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);

  // فلترة العمليات
  const filteredProcesses = React.useMemo(() => {
    return processes.filter((process) => {
      const matchesSearch =
        process.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || process.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [processes, searchQuery, statusFilter]);

  // إحصائيات
  const stats = React.useMemo(() => ({
    total: processes.length,
    inProgress: processes.filter((p) => p.status === "in-progress").length,
    completed: processes.filter((p) => p.status === "completed").length,
    delayed: processes.filter((p) => p.status === "delayed").length,
  }), [processes]);

  const handleViewProcess = (process: OnboardingProcess) => {
    setSelectedProcess(process);
    setIsViewSheetOpen(true);
  };

  const handleTaskStatusChange = (processId: string, taskId: string, completed: boolean) => {
    setProcesses(
      processes.map((p) => {
        if (p.id === processId) {
          const updatedTasks = p.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: completed ? ("completed" as const) : ("pending" as const),
                  completedDate: completed ? new Date().toISOString().split("T")[0] : undefined,
                }
              : t
          );
          const completedCount = updatedTasks.filter((t) => t.status === "completed").length;
          const progress = Math.round((completedCount / updatedTasks.length) * 100);
          return {
            ...p,
            tasks: updatedTasks,
            progress,
            status: progress === 100 ? ("completed" as OnboardingStatus) : p.status,
          };
        }
        return p;
      })
    );

    // تحديث الـ selectedProcess إذا كان مفتوحاً
    if (selectedProcess?.id === processId) {
      setSelectedProcess((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: completed ? ("completed" as const) : ("pending" as const),
                completedDate: completed ? new Date().toISOString().split("T")[0] : undefined,
              }
            : t
        );
        const completedCount = updatedTasks.filter((t) => t.status === "completed").length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return {
          ...prev,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? ("completed" as OnboardingStatus) : prev.status,
        };
      });
    }
  };

  const getTaskStatusColor = (status: OnboardingTask["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
            <CardTitle className="text-sm font-medium">إجمالي الموظفين الجدد</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">في عملية الإلحاق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
            <IconProgress className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">يمرون بالإجراءات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">أتموا الإلحاق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متأخرة</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
            <p className="text-xs text-muted-foreground">تحتاج متابعة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول الإلحاق */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>عمليات الإلحاق</CardTitle>
              <CardDescription>متابعة إجراءات الموظفين الجدد</CardDescription>
            </div>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <IconPlus className="ms-2 h-4 w-4" />
                  بدء إلحاق جديد
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>بدء عملية إلحاق جديدة</SheetTitle>
                  <SheetDescription>
                    اختر الموظف الجديد وقالب الإلحاق
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>الموظف الجديد</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموظف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp-1">أحمد محمد - مطور برمجيات</SelectItem>
                        <SelectItem value="emp-2">سارة علي - محللة بيانات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>قالب الإلحاق</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القالب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">القالب الافتراضي</SelectItem>
                        <SelectItem value="it">قالب تقنية المعلومات</SelectItem>
                        <SelectItem value="sales">قالب المبيعات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>تاريخ البدء</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>المرشد (Mentor)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المرشد (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp-m1">محمد أحمد - مدير تقني</SelectItem>
                        <SelectItem value="emp-m2">فاطمة علي - مدير قسم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-4" onClick={() => setIsAddSheetOpen(false)}>
                    بدء عملية الإلحاق
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
                placeholder="بحث عن موظف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <IconFilter className="ms-2 h-4 w-4" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(onboardingStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* جدول العمليات */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>التقدم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">لا توجد عمليات إلحاق</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {process.employeeName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{process.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{process.jobTitle}</TableCell>
                      <TableCell>{process.departmentName}</TableCell>
                      <TableCell>
                        {new Date(process.startDate).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={process.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground w-8">
                            {process.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={onboardingStatusColors[process.status]}>
                          {onboardingStatusLabels[process.status]}
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
                            <DropdownMenuItem onClick={() => handleViewProcess(process)}>
                              <IconClipboardList className="ms-2 h-4 w-4" />
                              عرض المهام
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconMail className="ms-2 h-4 w-4" />
                              إرسال تذكير
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

      {/* Sheet عرض المهام */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>مهام الإلحاق</SheetTitle>
            <SheetDescription>
              متابعة مهام {selectedProcess?.employeeName}
            </SheetDescription>
          </SheetHeader>
          {selectedProcess && (
            <div className="space-y-6 py-4">
              {/* معلومات الموظف */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedProcess.employeeName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedProcess.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProcess.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{selectedProcess.departmentName}</p>
                </div>
              </div>

              {/* التقدم */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>التقدم الكلي</span>
                  <span>{selectedProcess.progress}%</span>
                </div>
                <Progress value={selectedProcess.progress} className="h-3" />
              </div>

              {/* المرشد */}
              {selectedProcess.mentor && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">المرشد (Mentor)</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {selectedProcess.mentor.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{selectedProcess.mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedProcess.mentor.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* قائمة المهام */}
              <div>
                <h4 className="font-semibold mb-3">قائمة المهام</h4>
                <div className="space-y-3">
                  {selectedProcess.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                    >
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) =>
                          handleTaskStatusChange(selectedProcess.id, task.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {taskCategoryLabels[task.category]}
                          </Badge>
                          <Badge className={`text-xs ${getTaskStatusColor(task.status)}`}>
                            {taskStatusLabels[task.status]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          الموعد: {new Date(task.dueDate).toLocaleDateString("ar-SA")}
                        </p>
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
