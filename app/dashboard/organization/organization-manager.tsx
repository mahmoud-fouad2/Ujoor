"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPencil, IconPlus, IconTrash, IconBuilding, IconMapPin } from "@tabler/icons-react";

import type { Branch, OrganizationProfile } from "@/lib/types/core-hr";

// Validation
const companySchema = z.object({
  name: z.string().min(2, "اسم الشركة مطلوب"),
  nameAr: z.string().optional(),
  commercialRegister: z.string().optional(),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, "الدولة مطلوبة"),
  phone: z.string().optional(),
  email: z.string().email("البريد غير صالح").optional().or(z.literal("")),
  website: z.string().optional(),
});

const branchSchema = z.object({
  name: z.string().min(2, "اسم الفرع مطلوب"),
  nameAr: z.string().optional(),
  code: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, "الدولة مطلوبة"),
  phone: z.string().optional(),
  email: z.string().email("البريد غير صالح").optional().or(z.literal("")),
  isHeadquarters: z.boolean().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;
type BranchFormData = z.infer<typeof branchSchema>;

// Initial data
const initialCompany: OrganizationProfile = {
  id: "org-1",
  tenantId: "tenant-1",
  name: "Elite Technology Co.",
  nameAr: "شركة النخبة للتقنية",
  commercialRegister: "1010123456",
  taxNumber: "300123456700003",
  address: "شارع العليا، برج المملكة",
  city: "الرياض",
  country: "SA",
  phone: "+966112345678",
  email: "info@elite-tech.sa",
  website: "https://elite-tech.sa",
  updatedAt: "2026-01-01T10:00:00Z",
};

const initialBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Headquarters",
    nameAr: "المقر الرئيسي",
    code: "HQ",
    address: "شارع العليا، برج المملكة",
    city: "الرياض",
    country: "SA",
    phone: "+966112345678",
    email: "hq@elite-tech.sa",
    isHeadquarters: true,
    employeesCount: 45,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "branch-2",
    name: "Jeddah Branch",
    nameAr: "فرع جدة",
    code: "JED",
    address: "طريق الملك فهد",
    city: "جدة",
    country: "SA",
    phone: "+966122345678",
    email: "jeddah@elite-tech.sa",
    isHeadquarters: false,
    employeesCount: 20,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "branch-3",
    name: "Dammam Branch",
    nameAr: "فرع الدمام",
    code: "DMM",
    address: "شارع الأمير محمد بن فهد",
    city: "الدمام",
    country: "SA",
    phone: "+966132345678",
    isHeadquarters: false,
    employeesCount: 15,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
];

export function OrganizationManager() {
  const [company, setCompany] = useState<OrganizationProfile>(initialCompany);
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      nameAr: company.nameAr || "",
      commercialRegister: company.commercialRegister || "",
      taxNumber: company.taxNumber || "",
      address: company.address || "",
      city: company.city || "",
      country: company.country,
      phone: company.phone || "",
      email: company.email || "",
      website: company.website || "",
    },
  });

  const branchForm = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      code: "",
      address: "",
      city: "",
      country: "SA",
      phone: "",
      email: "",
      isHeadquarters: false,
    },
  });

  // Company form submit
  const onCompanySubmit = (data: CompanyFormData) => {
    setCompany((prev) => ({
      ...prev,
      ...data,
      updatedAt: new Date().toISOString(),
    }));
    setIsEditingCompany(false);
  };

  // Branch handlers
  const handleAddBranch = () => {
    setEditingBranch(null);
    branchForm.reset({
      name: "",
      nameAr: "",
      code: "",
      address: "",
      city: "",
      country: "SA",
      phone: "",
      email: "",
      isHeadquarters: false,
    });
    setBranchDialogOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    branchForm.reset({
      name: branch.name,
      nameAr: branch.nameAr || "",
      code: branch.code || "",
      address: branch.address || "",
      city: branch.city || "",
      country: branch.country,
      phone: branch.phone || "",
      email: branch.email || "",
      isHeadquarters: branch.isHeadquarters,
    });
    setBranchDialogOpen(true);
  };

  const onBranchSubmit = (data: BranchFormData) => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id
            ? {
                ...b,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );
    } else {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        name: data.name,
        nameAr: data.nameAr,
        code: data.code,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        email: data.email,
        isHeadquarters: data.isHeadquarters || false,
        employeesCount: 0,
        tenantId: "tenant-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBranches((prev) => [...prev, newBranch]);
    }
    setBranchDialogOpen(false);
    branchForm.reset();
  };

  const handleDeleteBranch = (branch: Branch) => {
    setBranchToDelete(branch);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBranch = () => {
    if (branchToDelete) {
      setBranches((prev) => prev.filter((b) => b.id !== branchToDelete.id));
      setDeleteDialogOpen(false);
      setBranchToDelete(null);
    }
  };

  const totalEmployees = branches.reduce((sum, b) => sum + b.employeesCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الفروع</CardDescription>
            <CardTitle className="text-3xl">{branches.length}</CardTitle>
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
            <CardDescription>المدن</CardDescription>
            <CardTitle className="text-3xl">
              {new Set(branches.map((b) => b.city)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">بيانات الشركة</TabsTrigger>
          <TabsTrigger value="branches">الفروع</TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconBuilding className="size-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{company.nameAr || company.name}</CardTitle>
                    <CardDescription>{company.name}</CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditingCompany ? "outline" : "default"}
                  onClick={() => {
                    if (isEditingCompany) {
                      companyForm.reset({
                        name: company.name,
                        nameAr: company.nameAr || "",
                        commercialRegister: company.commercialRegister || "",
                        taxNumber: company.taxNumber || "",
                        address: company.address || "",
                        city: company.city || "",
                        country: company.country,
                        phone: company.phone || "",
                        email: company.email || "",
                        website: company.website || "",
                      });
                    }
                    setIsEditingCompany(!isEditingCompany);
                  }}
                >
                  {isEditingCompany ? "إلغاء" : "تعديل"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingCompany ? (
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الشركة (EN) *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="nameAr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الشركة (AR)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="commercialRegister"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السجل التجاري</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرقم الضريبي</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={companyForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الدولة *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الهاتف</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الموقع الإلكتروني</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit">حفظ التعديلات</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">السجل التجاري</span>
                      <p className="font-medium">{company.commercialRegister || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">الرقم الضريبي</span>
                      <p className="font-medium">{company.taxNumber || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">العنوان</span>
                      <p className="font-medium">{company.address || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">المدينة</span>
                      <p className="font-medium">{company.city || "-"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">الهاتف</span>
                      <p className="font-medium">{company.phone || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
                      <p className="font-medium">{company.email || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">الموقع الإلكتروني</span>
                      <p className="font-medium">{company.website || "-"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>الفروع</CardTitle>
                  <CardDescription>إدارة فروع الشركة</CardDescription>
                </div>
                <Button onClick={handleAddBranch}>
                  <IconPlus className="ms-2 h-4 w-4" />
                  إضافة فرع
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">الفرع</TableHead>
                      <TableHead className="text-start">الرمز</TableHead>
                      <TableHead className="text-start">المدينة</TableHead>
                      <TableHead className="text-start">الموظفين</TableHead>
                      <TableHead className="text-start">النوع</TableHead>
                      <TableHead className="text-start w-[100px]">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد فروع
                        </TableCell>
                      </TableRow>
                    ) : (
                      branches.map((branch) => (
                        <TableRow key={branch.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconMapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{branch.nameAr || branch.name}</div>
                                {branch.nameAr && (
                                  <div className="text-sm text-muted-foreground">{branch.name}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {branch.code && <Badge variant="outline">{branch.code}</Badge>}
                          </TableCell>
                          <TableCell>{branch.city || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{branch.employeesCount}</Badge>
                          </TableCell>
                          <TableCell>
                            {branch.isHeadquarters ? (
                              <Badge className="bg-blue-500">المقر الرئيسي</Badge>
                            ) : (
                              <Badge variant="outline">فرع</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditBranch(branch)}
                              >
                                <IconPencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBranch(branch)}
                                disabled={branch.isHeadquarters || branch.employeesCount > 0}
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
        </TabsContent>
      </Tabs>

      {/* Branch Dialog */}
      <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingBranch ? "قم بتعديل بيانات الفرع" : "أدخل بيانات الفرع الجديد"}
            </DialogDescription>
          </DialogHeader>
          <Form {...branchForm}>
            <form onSubmit={branchForm.handleSubmit(onBranchSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={branchForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الفرع (EN) *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الفرع (AR)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={branchForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز الفرع</FormLabel>
                    <FormControl>
                      <Input placeholder="HQ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={branchForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={branchForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدولة *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={branchForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الهاتف</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBranchDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingBranch ? "حفظ" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الفرع "{branchToDelete?.nameAr || branchToDelete?.name}" نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBranch} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
