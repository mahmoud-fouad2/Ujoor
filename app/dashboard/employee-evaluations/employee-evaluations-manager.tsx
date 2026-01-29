"use client";

import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconCheck,
  IconX,
  IconDots,
  IconClipboardCheck,
  IconUser,
  IconUsers,
  IconCalendar,
  IconClock,
  IconFileExport,
  IconFilter,
  IconSearch,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import {
  EmployeeEvaluation,
  EvaluationReview,
  EmployeeEvaluationStatus,
  employeeEvaluationStatusLabels,
  employeeEvaluationStatusColors,
  formatScore,
  getRatingByScore,
  defaultPerformanceRatings,
} from "@/lib/types/performance";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function EmployeeEvaluationsManager() {
  const [evaluations, setEvaluations] = useState<EmployeeEvaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EmployeeEvaluation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [filterCycle, setFilterCycle] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<EmployeeEvaluationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    score: 0,
    comments: "",
    strengths: "",
    improvements: "",
    recommendations: "",
  });

  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (filterCycle !== "all" && evaluation.cycleId !== filterCycle) return false;
    if (filterStatus !== "all" && evaluation.status !== filterStatus) return false;
    if (
      searchQuery &&
      !evaluation.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: evaluations.length,
    pending: evaluations.filter((e) => e.status === "pending_self_review" || e.status === "pending_manager_review").length,
    completed: evaluations.filter((e) => e.status === "completed").length,
    avgScore: evaluations.filter((e) => e.finalScore).reduce((sum, e) => sum + (e.finalScore || 0), 0) / 
      evaluations.filter((e) => e.finalScore).length || 0,
  };

  const handleStartSelfReview = (evaluation: EmployeeEvaluation) => {
    setSelectedEvaluation(evaluation);
    setReviewForm({
      score: 0,
      comments: "",
      strengths: "",
      improvements: "",
      recommendations: "",
    });
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedEvaluation) return;

    const newReview: EvaluationReview = {
      id: `rev-${Date.now()}`,
      evaluationId: selectedEvaluation.id,
      reviewerId: "user-1",
      reviewerName: "المستخدم الحالي",
      reviewType: selectedEvaluation.status === "pending_self_review" ? "self" : "manager",
      score: reviewForm.score,
      comments: reviewForm.comments,
      strengths: reviewForm.strengths.split("\n").filter(Boolean),
      improvements: reviewForm.improvements.split("\n").filter(Boolean),
      recommendations: reviewForm.recommendations,
      submittedAt: new Date().toISOString(),
    };

    const updatedEvaluation: EmployeeEvaluation = {
      ...selectedEvaluation,
      status:
        selectedEvaluation.status === "pending_self_review"
          ? "pending_manager_review"
          : selectedEvaluation.template?.requiresCalibration
          ? "pending_calibration"
          : "pending_acknowledgment",
      selfReview:
        selectedEvaluation.status === "pending_self_review"
          ? newReview
          : selectedEvaluation.selfReview,
      managerReview:
        selectedEvaluation.status === "pending_manager_review"
          ? newReview
          : selectedEvaluation.managerReview,
      finalScore:
        selectedEvaluation.status !== "pending_self_review"
          ? reviewForm.score
          : undefined,
      updatedAt: new Date().toISOString(),
    };

    setEvaluations(
      evaluations.map((e) =>
        e.id === selectedEvaluation.id ? updatedEvaluation : e
      )
    );

    setIsReviewDialogOpen(false);
    setSelectedEvaluation(null);
  };

  const handleAcknowledge = (evaluationId: string) => {
    setEvaluations(
      evaluations.map((e) =>
        e.id === evaluationId
          ? {
              ...e,
              status: "completed" as EmployeeEvaluationStatus,
              acknowledgedAt: new Date().toISOString(),
            }
          : e
      )
    );
  };

  const handleView = (evaluation: EmployeeEvaluation) => {
    setSelectedEvaluation(evaluation);
    setIsViewDialogOpen(true);
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
          <h2 className="text-2xl font-bold">تقييمات الموظفين</h2>
          <p className="text-muted-foreground">عرض وإدارة تقييمات أداء الموظفين</p>
        </div>
        <Button variant="outline">
          <IconFileExport className="ms-2 h-4 w-4" />
          تصدير التقارير
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي التقييمات</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>قيد المراجعة</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
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
            <CardDescription>متوسط التقييم</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {formatScore(stats.avgScore)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم..."
            className="ps-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCycle} onValueChange={setFilterCycle}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="دورة التقييم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الدورات</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(value: EmployeeEvaluationStatus | "all") =>
            setFilterStatus(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(employeeEvaluationStatusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="my-reviews">تقييماتي</TabsTrigger>
          <TabsTrigger value="team-reviews">تقييمات الفريق</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>دورة التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التقييم الذاتي</TableHead>
                  <TableHead>تقييم المدير</TableHead>
                  <TableHead>التقييم النهائي</TableHead>
                  <TableHead className="w-[100px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={evaluation.employeeAvatar} />
                          <AvatarFallback>
                            {evaluation.employeeName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{evaluation.employeeName}</div>
                          <div className="text-xs text-muted-foreground">
                            {evaluation.jobTitle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{evaluation.departmentName}</TableCell>
                    <TableCell>{evaluation.cycleName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          employeeEvaluationStatusColors[evaluation.status]
                        }
                      >
                        {employeeEvaluationStatusLabels[evaluation.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {evaluation.selfReview ? (
                        <Badge variant="outline" className="bg-blue-50">
                          {formatScore(evaluation.selfReview.score)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation.managerReview ? (
                        <Badge variant="outline" className="bg-green-50">
                          {formatScore(evaluation.managerReview.score)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation.finalScore ? (
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: `${getRatingColor(evaluation.finalScore)}20`,
                              color: getRatingColor(evaluation.finalScore),
                            }}
                          >
                            {formatScore(evaluation.finalScore)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getRatingLabel(evaluation.finalScore)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(evaluation)}>
                            <IconEye className="ms-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {evaluation.status === "pending_self_review" && (
                            <DropdownMenuItem
                              onClick={() => handleStartSelfReview(evaluation)}
                            >
                              <IconEdit className="ms-2 h-4 w-4" />
                              بدء التقييم الذاتي
                            </DropdownMenuItem>
                          )}
                          {evaluation.status === "pending_manager_review" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEvaluation(evaluation);
                                setReviewForm({
                                  score: 0,
                                  comments: "",
                                  strengths: "",
                                  improvements: "",
                                  recommendations: "",
                                });
                                setIsReviewDialogOpen(true);
                              }}
                            >
                              <IconClipboardCheck className="ms-2 h-4 w-4" />
                              تقييم الموظف
                            </DropdownMenuItem>
                          )}
                          {evaluation.status === "pending_acknowledgment" && (
                            <DropdownMenuItem
                              onClick={() => handleAcknowledge(evaluation.id)}
                            >
                              <IconCheck className="ms-2 h-4 w-4" />
                              تأكيد الاستلام
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="my-reviews">
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              <IconUser className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>سيظهر هنا تقييماتك الشخصية</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team-reviews">
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              <IconUsers className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>سيظهر هنا تقييمات فريقك</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل التقييم</DialogTitle>
            <DialogDescription>
              عرض تفاصيل تقييم {selectedEvaluation?.employeeName}
            </DialogDescription>
          </DialogHeader>

          {selectedEvaluation && (
            <div className="space-y-6 py-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedEvaluation.employeeAvatar} />
                  <AvatarFallback className="text-xl">
                    {selectedEvaluation.employeeName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedEvaluation.employeeName}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedEvaluation.jobTitle} - {selectedEvaluation.departmentName}
                  </p>
                  <Badge
                    className={`mt-2 ${
                      employeeEvaluationStatusColors[selectedEvaluation.status]
                    }`}
                  >
                    {employeeEvaluationStatusLabels[selectedEvaluation.status]}
                  </Badge>
                </div>
              </div>

              {/* Cycle Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">معلومات الدورة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">الدورة</p>
                      <p className="font-medium">{selectedEvaluation.cycleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">النموذج</p>
                      <p className="font-medium">{selectedEvaluation.templateName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الفترة</p>
                      <p className="font-medium">
                        {selectedEvaluation.periodStart && selectedEvaluation.periodEnd ? (
                          <>
                            {format(new Date(selectedEvaluation.periodStart), "dd/MM/yyyy")} -{" "}
                            {format(new Date(selectedEvaluation.periodEnd), "dd/MM/yyyy")}
                          </>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Self Review */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      التقييم الذاتي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEvaluation.selfReview ? (
                      <div className="space-y-3">
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-3xl font-bold text-blue-600">
                            {formatScore(selectedEvaluation.selfReview.score)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getRatingLabel(selectedEvaluation.selfReview.score)}
                          </p>
                        </div>
                        {selectedEvaluation.selfReview.comments && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              الملاحظات
                            </p>
                            <p className="text-sm">
                              {selectedEvaluation.selfReview.comments}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        لم يتم تقديم التقييم الذاتي بعد
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Manager Review */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <IconUsers className="h-4 w-4" />
                      تقييم المدير
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEvaluation.managerReview ? (
                      <div className="space-y-3">
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-3xl font-bold text-green-600">
                            {formatScore(selectedEvaluation.managerReview.score)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getRatingLabel(selectedEvaluation.managerReview.score)}
                          </p>
                        </div>
                        {selectedEvaluation.managerReview.comments && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              الملاحظات
                            </p>
                            <p className="text-sm">
                              {selectedEvaluation.managerReview.comments}
                            </p>
                          </div>
                        )}
                        {selectedEvaluation.managerReview.strengths &&
                          selectedEvaluation.managerReview.strengths.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                نقاط القوة
                              </p>
                              <ul className="text-sm list-disc list-inside">
                                {selectedEvaluation.managerReview.strengths.map(
                                  (strength, i) => (
                                    <li key={i}>{strength}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        {selectedEvaluation.managerReview.improvements &&
                          selectedEvaluation.managerReview.improvements.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                مجالات التحسين
                              </p>
                              <ul className="text-sm list-disc list-inside">
                                {selectedEvaluation.managerReview.improvements.map(
                                  (improvement, i) => (
                                    <li key={i}>{improvement}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        لم يتم تقديم تقييم المدير بعد
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Final Score */}
              {selectedEvaluation.finalScore && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        التقييم النهائي
                      </p>
                      <p className="text-5xl font-bold mb-2">
                        {formatScore(selectedEvaluation.finalScore)}
                      </p>
                      <Badge
                        className="text-lg px-4 py-1"
                        style={{
                          backgroundColor: `${getRatingColor(
                            selectedEvaluation.finalScore
                          )}20`,
                          color: getRatingColor(selectedEvaluation.finalScore),
                        }}
                      >
                        {getRatingLabel(selectedEvaluation.finalScore)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvaluation?.status === "pending_self_review"
                ? "التقييم الذاتي"
                : "تقييم الموظف"}
            </DialogTitle>
            <DialogDescription>
              تقييم أداء {selectedEvaluation?.employeeName} لفترة{" "}
              {selectedEvaluation?.cycleName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Score Slider */}
            <div className="space-y-4">
              <Label>التقييم</Label>
              <div className="text-center p-6 rounded-lg bg-muted">
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {formatScore(reviewForm.score)}
                </p>
                <p className="text-muted-foreground">
                  {getRatingLabel(reviewForm.score)}
                </p>
              </div>
              <Slider
                value={[reviewForm.score]}
                onValueChange={([value]) =>
                  setReviewForm({ ...reviewForm, score: value })
                }
                max={5}
                step={0.1}
                className="py-4"
              />
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label>الملاحظات العامة</Label>
              <Textarea
                value={reviewForm.comments}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comments: e.target.value })
                }
                placeholder="أضف ملاحظاتك العامة..."
                rows={3}
              />
            </div>

            {/* Strengths & Improvements (for manager review) */}
            {selectedEvaluation?.status === "pending_manager_review" && (
              <>
                <div className="space-y-2">
                  <Label>نقاط القوة (سطر لكل نقطة)</Label>
                  <Textarea
                    value={reviewForm.strengths}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, strengths: e.target.value })
                    }
                    placeholder="أدخل نقاط القوة..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>مجالات التحسين (سطر لكل مجال)</Label>
                  <Textarea
                    value={reviewForm.improvements}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, improvements: e.target.value })
                    }
                    placeholder="أدخل مجالات التحسين..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>التوصيات</Label>
                  <Textarea
                    value={reviewForm.recommendations}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, recommendations: e.target.value })
                    }
                    placeholder="أدخل التوصيات..."
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewDialogOpen(false);
                setSelectedEvaluation(null);
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmitReview} disabled={reviewForm.score === 0}>
              <IconCheck className="ms-2 h-4 w-4" />
              إرسال التقييم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
