"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { IconPlus, IconPencil, IconTrash, IconSearch, IconEye, IconUser } from "@tabler/icons-react";

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

// Initial data
const initialDepartments: Department[] = [
  { id: "dept-1", name: "Human Resources", nameAr: "الموارد البشرية", code: "HR", employeesCount: 8, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "dept-2", name: "Information Technology", nameAr: "تقنية المعلومات", code: "IT", employeesCount: 15, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "dept-3", name: "Finance", nameAr: "المالية", code: "FIN", employeesCount: 6, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "dept-4", name: "Sales", nameAr: "المبيعات", code: "SALES", employeesCount: 20, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "dept-5", name: "Operations", nameAr: "العمليات", code: "OPS", employeesCount: 12, tenantId: "t1", createdAt: "", updatedAt: "" },
];

const initialJobTitles: JobTitle[] = [
  { id: "job-1", name: "Software Engineer", nameAr: "مهندس برمجيات", code: "SE", level: 2, employeesCount: 8, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "job-2", name: "Senior Software Engineer", nameAr: "مهندس برمجيات أول", code: "SSE", level: 3, employeesCount: 4, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "job-3", name: "HR Specialist", nameAr: "أخصائي موارد بشرية", code: "HRS", level: 2, employeesCount: 3, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "job-4", name: "Accountant", nameAr: "محاسب", code: "ACC", level: 2, employeesCount: 4, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "job-5", name: "Department Manager", nameAr: "مدير قسم", code: "MGR", level: 4, employeesCount: 5, tenantId: "t1", createdAt: "", updatedAt: "" },
  { id: "job-6", name: "Sales Representative", nameAr: "مندوب مبيعات", code: "SR", level: 1, employeesCount: 12, tenantId: "t1", createdAt: "", updatedAt: "" },
];

const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeNumber: "EMP001",
    firstName: "Ahmed",
    firstNameAr: "أحمد",
    lastName: "Al-Saud",
    lastNameAr: "آل سعود",
    email: "ahmed@company.sa",
    phone: "+966501234567",
    nationalId: "1234567890",
    nationality: "SA",
    gender: "male",
    maritalStatus: "married",
    departmentId: "dept-2",
    jobTitleId: "job-2",
    hireDate: "2024-03-15",
    contractType: "full_time",
    status: "active",
    basicSalary: 22000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-2",
    employeeNumber: "EMP002",
    firstName: "Fatima",
    firstNameAr: "فاطمة",
    lastName: "Al-Rashid",
    lastNameAr: "الراشد",
    email: "fatima@company.sa",
    phone: "+966502345678",
    gender: "female",
    maritalStatus: "single",
    departmentId: "dept-1",
    jobTitleId: "job-3",
    hireDate: "2024-06-01",
    contractType: "full_time",
    status: "active",
    basicSalary: 11000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-3",
    employeeNumber: "EMP003",
    firstName: "Mohammed",
    firstNameAr: "محمد",
    lastName: "Al-Harbi",
    lastNameAr: "الحربي",
    email: "mohammed@company.sa",
    phone: "+966503456789",
    gender: "male",
    maritalStatus: "married",
    departmentId: "dept-3",
    jobTitleId: "job-4",
    hireDate: "2025-01-10",
    contractType: "full_time",
    status: "active",
    basicSalary: 9500,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-4",
    employeeNumber: "EMP004",
    firstName: "Sara",
    firstNameAr: "سارة",
    lastName: "Al-Otaibi",
    lastNameAr: "العتيبي",
    email: "sara@company.sa",
    gender: "female",
    departmentId: "dept-4",
    jobTitleId: "job-6",
    hireDate: "2025-06-15",
    contractType: "full_time",
    status: "onboarding",
    basicSalary: 7000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-5",
    employeeNumber: "EMP005",
    firstName: "Khalid",
    firstNameAr: "خالد",
    lastName: "Al-Ghamdi",
    lastNameAr: "الغامدي",
    email: "khalid@company.sa",
    gender: "male",
    departmentId: "dept-5",
    jobTitleId: "job-5",
    hireDate: "2023-08-20",
    contractType: "full_time",
    status: "active",
    basicSalary: 28000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2023-08-20T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
];

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
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments] = useState<Department[]>(initialDepartments);
  const [jobTitles] = useState<JobTitle[]>(initialJobTitles);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

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
      emp.firstName.toLowerCase().includes(query) ||
      emp.firstNameAr?.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.lastNameAr?.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.employeeNumber.toLowerCase().includes(query);
    const matchesDept = filterDept === "all" || emp.departmentId === filterDept;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Get department/jobTitle name
  const getDeptName = (id: string) => departments.find((d) => d.id === id)?.nameAr || "-";
  const getJobName = (id: string) => jobTitles.find((j) => j.id === id)?.nameAr || "-";

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
  const onSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editingEmployee.id
            ? {
                ...e,
                ...data,
                basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : undefined,
                status: (data.status as EmployeeStatus) || e.status,
                contractType: data.contractType as ContractType,
                updatedAt: new Date().toISOString(),
              }
            : e
        )
      );
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        employeeNumber: data.employeeNumber || `EMP${Date.now()}`,
        firstName: data.firstName,
        firstNameAr: data.firstNameAr,
        lastName: data.lastName,
        lastNameAr: data.lastNameAr,
        email: data.email,
        phone: data.phone,
        nationalId: data.nationalId,
        departmentId: data.departmentId,
        jobTitleId: data.jobTitleId,
        managerId: data.managerId || undefined,
        hireDate: data.hireDate,
        contractType: data.contractType as ContractType,
        status: (data.status as EmployeeStatus) || "onboarding",
        basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : undefined,
        currency: "SAR",
        tenantId: "tenant-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin",
      };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setIsDialogOpen(false);
    form.reset();
  };

  // Delete
  const handleDeleteClick = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Stats
  const activeCount = employees.filter((e) => e.status === "active").length;
  const onboardingCount = employees.filter((e) => e.status === "onboarding").length;

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
            <Button onClick={handleAdd}>
              <IconPlus className="ms-2 h-4 w-4" />
              إضافة موظف
            </Button>
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

          {/* Table */}
          <div className="rounded-md border">
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
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      لا يوجد موظفون
                    </TableCell>
                  </TableRow>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingEmployee ? "حفظ التعديلات" : "إضافة"}
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
