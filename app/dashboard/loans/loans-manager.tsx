"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconCurrencyRiyal,
  IconUser,
  IconCalendar,
  IconReceipt,
  IconClock,
  IconAlertCircle,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  type Loan,
  type LoanStatus,
  loanStatusLabels,
  loanTypeLabels,
  formatCurrency,
} from "@/lib/types/payroll";
import { getEmployeeFullName } from "@/lib/types/core-hr";

export function LoansManager() {
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<LoanStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLoan, setEditingLoan] = React.useState<Loan | null>(null);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);

  // Form state
  const [formEmployeeId, setFormEmployeeId] = React.useState("");
  const [formType, setFormType] = React.useState<Loan["type"]>("salary_advance");
  const [formAmount, setFormAmount] = React.useState("");
  const [formInstallments, setFormInstallments] = React.useState("");
  const [formStartDate, setFormStartDate] = React.useState("");
  const [formReason, setFormReason] = React.useState("");

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = searchQuery === "";
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: loans.length,
    active: loans.filter((l) => l.status === "active").length,
    pending: loans.filter((l) => l.status === "pending").length,
    totalAmount: loans
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + l.remainingAmount, 0),
  };

  const resetForm = () => {
    setFormEmployeeId("");
    setFormType("salary_advance");
    setFormAmount("");
    setFormInstallments("");
    setFormStartDate("");
    setFormReason("");
    setEditingLoan(null);
  };

  const handleSubmit = () => {
    if (!formEmployeeId || !formAmount || !formInstallments) return;

    const amount = parseFloat(formAmount);
    const installments = parseInt(formInstallments);

    if (editingLoan) {
      setLoans((prev) =>
        prev.map((l) =>
          l.id === editingLoan.id
            ? {
                ...l,
                employeeId: formEmployeeId,
                type: formType,
                amount,
                installments,
                installmentAmount: amount / installments,
                startDate: formStartDate,
                reason: formReason,
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    } else {
      const newLoan: Loan = {
        id: `loan-${Date.now()}`,
        employeeId: formEmployeeId,
        tenantId: "tenant-1",
        type: formType,
        amount,
        installments,
        installmentAmount: amount / installments,
        remainingAmount: amount,
        paidInstallments: 0,
        interestRate: 0,
        startDate: formStartDate || new Date().toISOString().split("T")[0],
        status: "pending",
        reason: formReason,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLoans((prev) => [newLoan, ...prev]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleStatusChange = (loanId: string, newStatus: LoanStatus) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: newStatus,
              ...(newStatus === "approved" && {
                approvedBy: "current-user",
                approvedAt: new Date().toISOString(),
              }),
              ...(newStatus === "active" && {
                approvedBy: l.approvedBy || "current-user",
                approvedAt: l.approvedAt || new Date().toISOString(),
              }),
              ...(newStatus === "rejected" && {
                rejectedReason: "تم الرفض",
              }),
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );
  };

  const handleDelete = (loanId: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== loanId));
  };

  const openEditForm = (loan: Loan) => {
    setEditingLoan(loan);
    setFormEmployeeId(loan.employeeId);
    setFormType(loan.type);
    setFormAmount(loan.amount.toString());
    setFormInstallments(loan.installments.toString());
    setFormStartDate(loan.startDate);
    setFormReason(loan.reason || "");
    setIsFormOpen(true);
  };

  const getEmployeeName = (employeeId: string) => {
    return "غير معروف";
  };

  const getStatusBadge = (status: LoanStatus) => {
    const info = loanStatusLabels[status];
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "secondary",
      active: "default",
      completed: "secondary",
      rejected: "destructive",
      cancelled: "secondary",
    };
    return (
      <Badge
        variant={variants[status]}
        className={
          status === "active"
            ? "bg-green-500"
            : status === "pending"
            ? "bg-yellow-500 text-yellow-900"
            : ""
        }
      >
        {info.ar}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القروض</CardTitle>
            <IconReceipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قروض نشطة</CardTitle>
            <IconCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الموافقة</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبالغ المتبقية</CardTitle>
            <IconCurrencyRiyal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث باسم الموظف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as LoanStatus | "all")}
          >
            <SelectTrigger className="w-[160px]">
              <IconFilter className="h-4 w-4 ms-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {Object.entries(loanStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label.ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="ms-2 h-4 w-4" />
              طلب قرض جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingLoan ? "تعديل القرض" : "طلب قرض جديد"}</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل القرض أو السلفة
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>الموظف</Label>
                <Select value={formEmployeeId} onValueChange={setFormEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>نوع القرض</Label>
                <Select
                  value={formType}
                  onValueChange={(v) => setFormType(v as Loan["type"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(loanTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المبلغ (ر.س)</Label>
                  <Input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>عدد الأقساط</Label>
                  <Input
                    type="number"
                    value={formInstallments}
                    onChange={(e) => setFormInstallments(e.target.value)}
                    placeholder="12"
                  />
                </div>
              </div>

              {formAmount && formInstallments && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">قيمة القسط الشهري</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(
                      parseFloat(formAmount) / parseInt(formInstallments)
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>تاريخ البدء</Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>السبب (اختياري)</Label>
                <Textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="سبب طلب القرض..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formEmployeeId || !formAmount || !formInstallments}
              >
                {editingLoan ? "حفظ التعديلات" : "تقديم الطلب"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>القروض والسلف</CardTitle>
          <CardDescription>قائمة بجميع القروض والسلف للموظفين</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>القسط</TableHead>
                <TableHead>المتبقي</TableHead>
                <TableHead>التقدم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-start">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <IconReceipt className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد قروض</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => {
                  const progress =
                    ((loan.amount - loan.remainingAmount) / loan.amount) * 100;
                  return (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <IconUser className="h-4 w-4" />
                          </div>
                          <span className="font-medium">
                            {getEmployeeName(loan.employeeId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{loanTypeLabels[loan.type].ar}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(loan.amount)}</TableCell>
                      <TableCell>{formatCurrency(loan.installmentAmount)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(loan.remainingAmount)}
                      </TableCell>
                      <TableCell className="w-32">
                        {loan.status === "active" && (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {loan.paidInstallments}/{loan.installments}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {loan.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick={() => handleStatusChange(loan.id, "active")}
                              >
                                <IconCheck className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() => handleStatusChange(loan.id, "rejected")}
                              >
                                <IconX className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedLoan(loan)}
                          >
                            <IconCalendar className="h-4 w-4" />
                          </Button>
                          {(loan.status === "pending" || loan.status === "approved") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditForm(loan)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                          )}
                          {loan.status !== "active" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف القرض</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا القرض؟
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(loan.id)}
                                    className="bg-destructive"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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

      {/* Loan Details Dialog */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تفاصيل القرض</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">الموظف</p>
                  <p className="font-medium">{getEmployeeName(selectedLoan.employeeId)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">النوع</p>
                  <p className="font-medium">{loanTypeLabels[selectedLoan.type].ar}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المبلغ الإجمالي</p>
                  <p className="font-medium">{formatCurrency(selectedLoan.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">قيمة القسط</p>
                  <p className="font-medium">
                    {formatCurrency(selectedLoan.installmentAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">الأقساط المدفوعة</p>
                  <p className="font-medium">
                    {selectedLoan.paidInstallments} من {selectedLoan.installments}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">المبلغ المتبقي</p>
                  <p className="font-medium text-orange-600">
                    {formatCurrency(selectedLoan.remainingAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">تاريخ البدء</p>
                  <p className="font-medium">{selectedLoan.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الحالة</p>
                  {getStatusBadge(selectedLoan.status)}
                </div>
              </div>

              {selectedLoan.reason && (
                <div>
                  <p className="text-muted-foreground text-sm">السبب</p>
                  <p className="font-medium">{selectedLoan.reason}</p>
                </div>
              )}

              {selectedLoan.status === "active" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">تقدم السداد</p>
                  <Progress
                    value={
                      ((selectedLoan.amount - selectedLoan.remainingAmount) /
                        selectedLoan.amount) *
                      100
                    }
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground text-start">
                    {(
                      ((selectedLoan.amount - selectedLoan.remainingAmount) /
                        selectedLoan.amount) *
                      100
                    ).toFixed(0)}
                    % مكتمل
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
