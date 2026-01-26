"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { TableEmptyRow } from "@/components/empty-states/table-empty-row";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPlus, IconPencil, IconTrash, IconSearch, IconEye, IconUser, IconRefresh } from "@tabler/icons-react";

import type { Employee, Department, JobTitle, ContractType, EmployeeStatus } from "@/lib/types/core-hr";
import { getEmployeeFullName } from "@/lib/types/core-hr";

// Validation
const employeeSchema = z.object({
  employeeNumber: z.string().optional(),
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  firstNameAr: z.string().optional(),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
  lastNameAr: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
  departmentId: z.string().min(1, "القسم مطلوب"),
  jobTitleId: z.string().min(1, "المسمى الوظيفي مطلوب"),
  managerId: z.string().optional(),
  hireDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  contractType: z.string().min(1, "نوع العقد مطلوب"),
  basicSalary: z.string().optional(),
  status: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const contractTypes: { value: ContractType; label: string }[] = [
  { value: "full_time", label: "دوام كامل" },
  { value: "part_time", label: "دوام جزئي" },
  { value: "contract", label: "عقد مؤقت" },
  { value: "intern", label: "متدرب" },
];

const statusOptions: { value: EmployeeStatus; label: string; color: string }[] = [
  { value: "active", label: "نشط", color: "bg-green-500" },
  { value: "onboarding", label: "قيد التعيين", color: "bg-blue-500" },
  { value: "on_leave", label: "في إجازة", color: "bg-yellow-500" },
  { value: "terminated", label: "منتهي الخدمة", color: "bg-red-500" },
];

function getStatusBadge(status: EmployeeStatus) {
  const opt = statusOptions.find((s) => s.value === status);
  if (!opt) return <Badge variant="outline">{status}</Badge>;
  return <Badge className={opt.color}>{opt.label}</Badge>;
}

export function EmployeesManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch data from API
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("فشل في جلب بيانات الموظفين");
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  const fetchJobTitles = useCallback(async () => {
    try {
      const res = await fetch("/api/job-titles");
      if (!res.ok) throw new Error("Failed to fetch job titles");
      const data = await res.json();
      setJobTitles(data.data || []);
    } catch (error) {
      console.error("Error fetching job titles:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchDepartments(), fetchJobTitles()]);
      setLoading(false);
    };
    loadData();
  }, [fetchEmployees, fetchDepartments, fetchJobTitles]);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeNumber: "",
      firstName: "",
      firstNameAr: "",
      lastName: "",
      lastNameAr: "",
      email: "",
      phone: "",
      nationalId: "",
      departmentId: "",
      jobTitleId: "",
      managerId: "",
      hireDate: "",
      contractType: "full_time",
      basicSalary: "",
      status: "active",
    },
  });

  // Filter
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      emp.firstName?.toLowerCase().includes(query) ||
      emp.firstNameAr?.toLowerCase().includes(query) ||
      emp.lastName?.toLowerCase().includes(query) ||
      emp.lastNameAr?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query) ||
      emp.employeeNumber?.toLowerCase().includes(query);
    const matchesDept = filterDept === "all" || emp.departmentId === filterDept;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Get department/jobTitle name
  const getDeptName = (id: string) => departments.find((d) => d.id === id)?.nameAr || departments.find((d) => d.id === id)?.name || "-";
  const getJobName = (id: string) => jobTitles.find((j) => j.id === id)?.nameAr || jobTitles.find((j) => j.id === id)?.name || "-";

  // Add
  const handleAdd = () => {
    setEditingEmployee(null);
    const nextNum = employees.length + 1;
    form.reset({
      employeeNumber: `EMP${String(nextNum).padStart(3, "0")}`,
      firstName: "",
      firstNameAr: "",
      lastName: "",
      lastNameAr: "",
      email: "",
      phone: "",
      nationalId: "",
      departmentId: "",
      jobTitleId: "",
      managerId: "",
      hireDate: new Date().toISOString().split("T")[0],
      contractType: "full_time",
      basicSalary: "",
      status: "onboarding",
    });
    setIsDialogOpen(true);
  };

  // Edit
  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    form.reset({
      employeeNumber: emp.employeeNumber,
      firstName: emp.firstName,
      firstNameAr: emp.firstNameAr || "",
      lastName: emp.lastName,
      lastNameAr: emp.lastNameAr || "",
      email: emp.email,
      phone: emp.phone || "",
      nationalId: emp.nationalId || "",
      departmentId: emp.departmentId,
      jobTitleId: emp.jobTitleId,
      managerId: emp.managerId || "",
      hireDate: emp.hireDate,
      contractType: emp.contractType,
      basicSalary: emp.basicSalary?.toString() || "",
      status: emp.status,
    });
    setIsDialogOpen(true);
  };

  // Submit
  const onSubmit = async (data: EmployeeFormData) => {
    setSaving(true);
    try {
      if (editingEmployee) {
        // Update existing employee
        const res = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed to update employee");
        toast.success("تم تحديث بيانات الموظف بنجاح");
        await fetchEmployees();
      } else {
        // Create new employee
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed to create employee");
        toast.success("تم إضافة الموظف بنجاح");
        await fetchEmployees();
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error(editingEmployee ? "فشل في تحديث الموظف" : "فشل في إضافة الموظف");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDeleteClick = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        const res = await fetch(`/api/employees/${employeeToDelete.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete employee");
        toast.success("تم حذف الموظف بنجاح");
        await fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("فشل في حذف الموظف");
      } finally {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  // Stats
  const activeCount = employees.filter((e) => e.status === "active").length;
  const onboardingCount = employees.filter((e) => e.status === "onboarding").length;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الموظفين</CardDescription>
            <CardTitle className="text-3xl">{employees.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>نشطين</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>قيد التعيين</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{onboardingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>الأقسام</CardDescription>
            <CardTitle className="text-3xl">{departments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>الموظفون</CardTitle>
              <CardDescription>إدارة بيانات الموظفين</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={fetchEmployees} title="تحديث">
                <IconRefresh className="h-4 w-4" />
              </Button>
              <Button onClick={handleAdd}>
                <IconPlus className="ms-2 h-4 w-4" />
                إضافة موظف
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الرقم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأقسام</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nameAr || d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {filteredEmployees.length === 0 ? (
              <Empty className="border rounded-lg">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconUser className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle>لا يوجد موظفون</EmptyTitle>
                  <EmptyDescription>
                    ابدأ بإضافة أول موظف لعرض البيانات هنا.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={handleAdd}>
                    <IconPlus className="ms-2 h-4 w-4" />
                    إضافة موظف
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              filteredEmployees.map((emp) => (
                <Card key={emp.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <IconUser className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{getEmployeeFullName(emp, "ar")}</div>
                            <div className="text-sm text-muted-foreground truncate">{emp.email}</div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                          <div className="text-muted-foreground">الرقم</div>
                          <div className="text-start"><Badge variant="outline">{emp.employeeNumber}</Badge></div>

                          <div className="text-muted-foreground">القسم</div>
                          <div className="text-start truncate">{getDeptName(emp.departmentId)}</div>

                          <div className="text-muted-foreground">المسمى</div>
                          <div className="text-start truncate">{getJobName(emp.jobTitleId)}</div>

                          <div className="text-muted-foreground">الحالة</div>
                          <div className="text-start">{getStatusBadge(emp.status)}</div>

                          <div className="text-muted-foreground">تاريخ التعيين</div>
                          <div className="text-start">{emp.hireDate}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setViewingEmployee(emp)}>
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}>
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(emp)}>
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">الرقم</TableHead>
                  <TableHead className="text-start">الاسم</TableHead>
                  <TableHead className="text-start">القسم</TableHead>
                  <TableHead className="text-start">المسمى</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start">تاريخ التعيين</TableHead>
                  <TableHead className="text-start w-[120px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableEmptyRow
                    colSpan={7}
                    title="لا يوجد موظفون"
                    description="ابدأ بإضافة أول موظف لعرض البيانات هنا."
                    icon={<IconUser className="size-5" />}
                    actionLabel="إضافة موظف"
                    onAction={handleAdd}
                  />
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <Badge variant="outline">{emp.employeeNumber}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                            <IconUser className="size-4" />
                          </div>
                          <div>
                            <div className="font-medium">{getEmployeeFullName(emp, "ar")}</div>
                            <div className="text-sm text-muted-foreground">{emp.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getDeptName(emp.departmentId)}</TableCell>
                      <TableCell>{getJobName(emp.jobTitleId)}</TableCell>
                      <TableCell>{getStatusBadge(emp.status)}</TableCell>
                      <TableCell>{emp.hireDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingEmployee(emp)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(emp)}
                          >
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(emp)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee ? "قم بتعديل البيانات" : "أدخل بيانات الموظف الجديد"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                  <TabsTrigger value="employment">بيانات التوظيف</TabsTrigger>
                  <TabsTrigger value="salary">الراتب</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الأول (EN) *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstNameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الأول (AR)</FormLabel>
                          <FormControl>
                            <Input placeholder="أحمد" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العائلة (EN) *</FormLabel>
                          <FormControl>
                            <Input placeholder="Al-Saud" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastNameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العائلة (AR)</FormLabel>
                          <FormControl>
                            <Input placeholder="آل سعود" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ahmed@company.sa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input placeholder="+966501234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهوية</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="employment" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="employeeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرقم الوظيفي</FormLabel>
                        <FormControl>
                          <Input placeholder="EMP001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>القسم *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر القسم" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                  {d.nameAr || d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobTitleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المسمى الوظيفي *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المسمى" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobTitles.map((j) => (
                                <SelectItem key={j.id} value={j.id}>
                                  {j.nameAr || j.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ التعيين *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع العقد *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع العقد" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contractTypes.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الحالة</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="salary" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الراتب الأساسي (ر.س)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    سيتم إضافة المزيد من تفاصيل الراتب والبدلات في Phase 5 (Payroll).
                  </p>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : editingEmployee ? "حفظ التعديلات" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingEmployee} onOpenChange={() => setViewingEmployee(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>بيانات الموظف</DialogTitle>
          </DialogHeader>
          {viewingEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                  <IconUser className="size-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{getEmployeeFullName(viewingEmployee, "ar")}</h3>
                  <p className="text-sm text-muted-foreground">{viewingEmployee.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">الرقم الوظيفي:</span>
                  <p className="font-medium">{viewingEmployee.employeeNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">الحالة:</span>
                  <p>{getStatusBadge(viewingEmployee.status)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">القسم:</span>
                  <p className="font-medium">{getDeptName(viewingEmployee.departmentId)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">المسمى:</span>
                  <p className="font-medium">{getJobName(viewingEmployee.jobTitleId)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">تاريخ التعيين:</span>
                  <p className="font-medium">{viewingEmployee.hireDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">الهاتف:</span>
                  <p className="font-medium">{viewingEmployee.phone || "-"}</p>
                </div>
                {viewingEmployee.basicSalary && (
                  <div>
                    <span className="text-muted-foreground">الراتب:</span>
                    <p className="font-medium">{viewingEmployee.basicSalary.toLocaleString()} ر.س</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingEmployee(null)}>
              إغلاق
            </Button>
            <Button onClick={() => { handleEdit(viewingEmployee!); setViewingEmployee(null); }}>
              تعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الموظف "{employeeToDelete && getEmployeeFullName(employeeToDelete, "ar")}" نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
