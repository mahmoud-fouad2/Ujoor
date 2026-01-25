"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";

import type { Department, DepartmentCreateInput } from "@/lib/types/core-hr";

// Validation schema
const departmentSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفين على الأقل)"),
  nameAr: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

// Initial data (will be replaced by API calls)
const initialDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Human Resources",
    nameAr: "الموارد البشرية",
    code: "HR",
    description: "إدارة شؤون الموظفين والتوظيف",
    employeesCount: 8,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-2",
    name: "Information Technology",
    nameAr: "تقنية المعلومات",
    code: "IT",
    description: "البنية التحتية والأنظمة",
    employeesCount: 15,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-3",
    name: "Finance",
    nameAr: "المالية",
    code: "FIN",
    description: "المحاسبة والشؤون المالية",
    employeesCount: 6,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-4",
    name: "Sales",
    nameAr: "المبيعات",
    code: "SALES",
    description: "فريق المبيعات وتطوير الأعمال",
    employeesCount: 20,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-5",
    name: "Operations",
    nameAr: "العمليات",
    code: "OPS",
    description: "إدارة العمليات والتشغيل",
    employeesCount: 12,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
];

export function DepartmentsManager() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      code: "",
      description: "",
      parentId: "",
    },
  });

  // Filter departments
  const filteredDepartments = departments.filter((dept) => {
    const query = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(query) ||
      dept.nameAr?.toLowerCase().includes(query) ||
      dept.code?.toLowerCase().includes(query)
    );
  });

  // Open dialog for new department
  const handleAdd = () => {
    setEditingDepartment(null);
    form.reset({
      name: "",
      nameAr: "",
      code: "",
      description: "",
      parentId: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    form.reset({
      name: dept.name,
      nameAr: dept.nameAr || "",
      code: dept.code || "",
      description: dept.description || "",
      parentId: dept.parentId || "",
    });
    setIsDialogOpen(true);
  };

  // Handle form submit
  const onSubmit = (data: DepartmentFormData) => {
    if (editingDepartment) {
      // Update existing
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDepartment.id
            ? {
                ...d,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
    } else {
      // Create new
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: data.name,
        nameAr: data.nameAr,
        code: data.code,
        description: data.description,
        parentId: data.parentId || undefined,
        employeesCount: 0,
        tenantId: "tenant-1", // From context in real app
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDepartments((prev) => [...prev, newDept]);
    }
    setIsDialogOpen(false);
    form.reset();
  };

  // Handle delete
  const handleDeleteClick = (dept: Department) => {
    setDepartmentToDelete(dept);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      setDepartments((prev) => prev.filter((d) => d.id !== departmentToDelete.id));
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    }
  };

  // Stats
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeesCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الأقسام</CardDescription>
            <CardTitle className="text-3xl">{departments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الموظفين</CardDescription>
            <CardTitle className="text-3xl">{totalEmployees}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>متوسط الموظفين لكل قسم</CardDescription>
            <CardTitle className="text-3xl">
              {departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>الأقسام</CardTitle>
              <CardDescription>إدارة أقسام الشركة والهيكل التنظيمي</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <IconPlus className="ms-2 h-4 w-4" />
              إضافة قسم
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">الاسم</TableHead>
                  <TableHead className="text-start">الرمز</TableHead>
                  <TableHead className="text-start">الوصف</TableHead>
                  <TableHead className="text-start">الموظفين</TableHead>
                  <TableHead className="text-start w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد أقسام
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{dept.nameAr || dept.name}</div>
                          {dept.nameAr && (
                            <div className="text-sm text-muted-foreground">{dept.name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {dept.code && <Badge variant="outline">{dept.code}</Badge>}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {dept.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dept.employeesCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(dept)}
                          >
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(dept)}
                            disabled={dept.employeesCount > 0}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "تعديل القسم" : "إضافة قسم جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "قم بتعديل بيانات القسم"
                : "أدخل بيانات القسم الجديد"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (بالإنجليزية) *</FormLabel>
                    <FormControl>
                      <Input placeholder="Human Resources" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (بالعربية)</FormLabel>
                    <FormControl>
                      <Input placeholder="الموارد البشرية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز القسم</FormLabel>
                    <FormControl>
                      <Input placeholder="HR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القسم الأب</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم الأب (اختياري)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون (قسم رئيسي)</SelectItem>
                        {departments
                          .filter((d) => d.id !== editingDepartment?.id)
                          .map((d) => (
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="وصف مختصر للقسم..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingDepartment ? "حفظ التعديلات" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف القسم "{departmentToDelete?.nameAr || departmentToDelete?.name}" نهائياً.
              هذا الإجراء لا يمكن التراجع عنه.
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
