"use client";

import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconTarget,
  IconCheck,
  IconX,
  IconDots,
  IconProgress,
  IconFlag,
  IconCalendar,
  IconUser,
  IconUsers,
  IconBuilding,
  IconWorld,
  IconChevronDown,
  IconChevronUp,
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
import { Progress } from "@/components/ui/progress";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PerformanceGoal,
  GoalMilestone,
  GoalType,
  GoalStatus,
  GoalPriority,
  goalTypeLabels,
  goalStatusLabels,
  goalPriorityLabels,
  goalStatusColors,
  goalPriorityColors,
  mockPerformanceGoals,
  calculateProgress,
  determineGoalStatus,
} from "@/lib/types/performance";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function PerformanceGoalsManager() {
  const [goals, setGoals] = useState<PerformanceGoal[]>(mockPerformanceGoals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [filterType, setFilterType] = useState<GoalType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<GoalStatus | "all">("all");
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<PerformanceGoal>>({
    title: "",
    description: "",
    type: "individual",
    priority: "medium",
    targetValue: 100,
    currentValue: 0,
    unit: "%",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    milestones: [],
  });

  // Milestone form
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    dueDate: "",
    targetValue: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "individual",
      priority: "medium",
      targetValue: 100,
      currentValue: 0,
      unit: "%",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      milestones: [],
    });
    setMilestoneForm({ title: "", dueDate: "", targetValue: 0 });
  };

  const handleAddMilestone = () => {
    if (!milestoneForm.title || !milestoneForm.dueDate) return;

    const newMilestone: GoalMilestone = {
      id: `ms-${Date.now()}`,
      goalId: selectedGoal?.id || "",
      title: milestoneForm.title,
      dueDate: milestoneForm.dueDate,
      targetValue: milestoneForm.targetValue,
      isCompleted: false,
      order: (formData.milestones?.length || 0) + 1,
    };

    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), newMilestone],
    });

    setMilestoneForm({ title: "", dueDate: "", targetValue: 0 });
  };

  const handleRemoveMilestone = (milestoneId: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones?.filter((m) => m.id !== milestoneId),
    });
  };

  const handleSave = () => {
    // Create a partial goal to calculate status
    const partialGoal = {
      startDate: formData.startDate || "",
      dueDate: formData.dueDate || "",
      progress: formData.currentValue && formData.targetValue
        ? calculateProgress(formData.currentValue, formData.targetValue)
        : 0,
    } as PerformanceGoal;

    const goal: PerformanceGoal = {
      ...(formData as PerformanceGoal),
      id: selectedGoal?.id || `goal-${Date.now()}`,
      tenantId: "tenant-1",
      employeeId: "emp-1",
      employeeName: "أحمد محمد",
      progress: partialGoal.progress,
      status: determineGoalStatus(partialGoal),
      createdAt: selectedGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditDialogOpen && selectedGoal) {
      setGoals(goals.map((g) => (g.id === selectedGoal.id ? goal : g)));
    } else {
      setGoals([...goals, goal]);
    }

    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedGoal(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            milestones: g.milestones.map((m) =>
              m.id === milestoneId
                ? { ...m, isCompleted: !m.isCompleted, completedDate: !m.isCompleted ? new Date().toISOString() : undefined }
                : m
            ),
          };
        }
        return g;
      })
    );
  };

  const handleUpdateProgress = (goalId: string, newValue: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          const progress = calculateProgress(newValue, g.targetValue);
          return {
            ...g,
            currentValue: newValue,
            status: progress >= 100 ? "completed" : g.status,
            completedDate: progress >= 100 ? new Date().toISOString() : g.completedDate,
          };
        }
        return g;
      })
    );
  };

  const openEditDialog = (goal: PerformanceGoal) => {
    setSelectedGoal(goal);
    setFormData(goal);
    setIsEditDialogOpen(true);
  };

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const getTypeIcon = (type: GoalType) => {
    switch (type) {
      case "individual":
        return <IconUser className="h-4 w-4" />;
      case "team":
        return <IconUsers className="h-4 w-4" />;
      case "department":
        return <IconBuilding className="h-4 w-4" />;
      case "company":
        return <IconWorld className="h-4 w-4" />;
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filterType !== "all" && goal.type !== filterType) return false;
    if (filterStatus !== "all" && goal.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.status === "completed").length,
    inProgress: goals.filter((g) => g.status === "in_progress").length,
    atRisk: goals.filter((g) => g.status === "at_risk" || g.status === "overdue").length,
    avgProgress: Math.round(
      goals.reduce((sum, g) => sum + calculateProgress(g.currentValue, g.targetValue), 0) / goals.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">أهداف الأداء</h2>
          <p className="text-muted-foreground">إدارة ومتابعة أهداف الأداء والمؤشرات</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <IconPlus className="ms-2 h-4 w-4" />
          إضافة هدف
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الأهداف</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>مكتملة</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>قيد التنفيذ</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>في خطر/متأخرة</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.atRisk}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>متوسط التقدم</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{stats.avgProgress}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterType} onValueChange={(value: GoalType | "all") => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع الهدف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {Object.entries(goalTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(value: GoalStatus | "all") => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(goalStatusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Goals Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">قائمة</TabsTrigger>
          <TabsTrigger value="kanban">لوحة</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredGoals.map((goal) => (
            <Collapsible
              key={goal.id}
              open={expandedGoals.includes(goal.id)}
              onOpenChange={() => toggleGoalExpanded(goal.id)}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(goal.type)}
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge className={goalStatusColors[goal.status]}>
                          {goalStatusLabels[goal.status]}
                        </Badge>
                        <Badge variant="outline" className={goalPriorityColors[goal.priority]}>
                          {goalPriorityLabels[goal.priority]}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <IconUser className="h-3 w-3" />
                          {goal.employeeName}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconCalendar className="h-3 w-3" />
                          {format(new Date(goal.dueDate), "dd MMM yyyy", { locale: ar })}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconFlag className="h-3 w-3" />
                          {goalTypeLabels[goal.type]}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {expandedGoals.includes(goal.id) ? (
                            <IconChevronUp className="h-4 w-4" />
                          ) : (
                            <IconChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(goal)}>
                            <IconEdit className="ms-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <IconTrash className="ms-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>التقدم</span>
                      <span className="font-medium">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(goal.currentValue, goal.targetValue)}
                      className="h-2"
                    />
                  </div>

                  <CollapsibleContent className="pt-4">
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                    )}

                    {/* Update Progress */}
                    <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted">
                      <Label>تحديث التقدم:</Label>
                      <Input
                        type="number"
                        className="w-24"
                        value={goal.currentValue}
                        onChange={(e) =>
                          handleUpdateProgress(goal.id, Number(e.target.value))
                        }
                        max={goal.targetValue}
                        min={0}
                      />
                      <span className="text-sm text-muted-foreground">
                        من {goal.targetValue} {goal.unit}
                      </span>
                    </div>

                    {/* Milestones */}
                    {goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">المعالم:</h4>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                milestone.isCompleted ? "bg-green-50 border-green-200" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    milestone.isCompleted
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {milestone.isCompleted && (
                                    <IconCheck className="h-3 w-3 text-white" />
                                  )}
                                </button>
                                <span className={milestone.isCompleted ? "line-through text-muted-foreground" : ""}>
                                  {milestone.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {milestone.targetValue && (
                                  <Badge variant="outline">{milestone.targetValue} {goal.unit}</Badge>
                                )}
                                <span>{format(new Date(milestone.dueDate), "dd/MM/yyyy")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid gap-4 md:grid-cols-4">
            {(["not_started", "in_progress", "at_risk", "completed"] as GoalStatus[]).map(
              (status) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={goalStatusColors[status]}>
                      {goalStatusLabels[status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {filteredGoals.filter((g) => g.status === status).length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredGoals
                      .filter((g) => g.status === status)
                      .map((goal) => (
                        <Card
                          key={goal.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => openEditDialog(goal)}
                        >
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">{goal.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {goal.employeeName}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <Progress
                              value={calculateProgress(goal.currentValue, goal.targetValue)}
                              className="h-1"
                            />
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>{calculateProgress(goal.currentValue, goal.targetValue)}%</span>
                              <Badge variant="outline" className={goalPriorityColors[goal.priority]}>
                                {goalPriorityLabels[goal.priority]}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedGoal(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "تعديل الهدف" : "إضافة هدف جديد"}
            </DialogTitle>
            <DialogDescription>
              تحديد تفاصيل الهدف ومعالمه
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>عنوان الهدف *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: زيادة المبيعات بنسبة 20%"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف تفصيلي للهدف..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>نوع الهدف</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: GoalType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: GoalPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalPriorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>القيمة المستهدفة *</Label>
                <Input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) =>
                    setFormData({ ...formData, targetValue: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>الوحدة</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">نسبة مئوية %</SelectItem>
                    <SelectItem value="عدد">عدد</SelectItem>
                    <SelectItem value="ريال">ريال</SelectItem>
                    <SelectItem value="ساعة">ساعة</SelectItem>
                    <SelectItem value="يوم">يوم</SelectItem>
                    <SelectItem value="مهمة">مهمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تاريخ البداية *</Label>
                <Input
                  type="date"
                  value={formData.startDate?.split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الانتهاء *</Label>
                <Input
                  type="date"
                  value={formData.dueDate?.split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">المعالم (اختياري)</h4>
              <div className="rounded-lg border p-3 space-y-3">
                <div className="grid gap-3 md:grid-cols-4">
                  <Input
                    placeholder="عنوان المعلم"
                    value={milestoneForm.title}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, title: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    value={milestoneForm.dueDate}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="القيمة المستهدفة"
                    value={milestoneForm.targetValue || ""}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, targetValue: Number(e.target.value) })
                    }
                  />
                  <Button
                    onClick={handleAddMilestone}
                    disabled={!milestoneForm.title || !milestoneForm.dueDate}
                  >
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.milestones && formData.milestones.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-2 rounded-lg border"
                    >
                      <span>{milestone.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(milestone.dueDate), "dd/MM/yyyy")}
                        </span>
                        {milestone.targetValue && (
                          <Badge variant="outline">{milestone.targetValue}</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveMilestone(milestone.id)}
                        >
                          <IconX className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedGoal(null);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.dueDate || !formData.targetValue}
            >
              <IconCheck className="ms-2 h-4 w-4" />
              {isEditDialogOpen ? "حفظ التعديلات" : "إضافة الهدف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
