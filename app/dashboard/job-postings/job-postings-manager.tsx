"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconBriefcase,
  IconMapPin,
  IconClock,
  IconUsers,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  JobPosting,
  JobStatus,
  JobType,
  ExperienceLevel,
  jobStatusLabels,
  jobStatusColors,
  jobTypeLabels,
  experienceLevelLabels,
} from "@/lib/types/recruitment";
import { getJobPostings } from "@/lib/api/recruitment";

export function JobPostingsManager() {
  const [jobs, setJobs] = React.useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<JobPosting | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false);
  const [deleteJobId, setDeleteJobId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await getJobPostings();
        if (!isMounted) return;
        setJobs(res);
      } catch {
        if (!isMounted) return;
        setJobs([]);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  // فلترة الوظائف
  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // إحصائيات سريعة
  const stats = React.useMemo(() => ({
    total: jobs.length,
    open: jobs.filter((j) => j.status === "open").length,
    filled: jobs.filter((j) => j.status === "filled").length,
    totalPositions: jobs.reduce((sum, j) => sum + j.openPositions, 0),
  }), [jobs]);

  const handleViewJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsViewSheetOpen(true);
  };

  const handleDeleteJob = (id: string) => {
    setDeleteJobId(id);
  };

  const confirmDeleteJob = () => {
    if (!deleteJobId) return;
    setJobs((prev) => prev.filter((j) => j.id !== deleteJobId));
    setDeleteJobId(null);
  };

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الوظائف</CardTitle>
            <IconBriefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">وظيفة مُعلنة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الوظائف المفتوحة</CardTitle>
            <IconUsers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">تقبل طلبات التقديم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تم شغلها</CardTitle>
            <IconBriefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.filled}</div>
            <p className="text-xs text-muted-foreground">وظيفة تم شغلها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المناصب الشاغرة</CardTitle>
            <IconUsers className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalPositions}</div>
            <p className="text-xs text-muted-foreground">منصب متاح</p>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلاتر */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>الوظائف الشاغرة</CardTitle>
              <CardDescription>إدارة إعلانات الوظائف والمناصب الشاغرة</CardDescription>
            </div>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <IconPlus className="ms-2 h-4 w-4" />
                  إضافة وظيفة
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>إضافة وظيفة جديدة</SheetTitle>
                  <SheetDescription>
                    أدخل تفاصيل الوظيفة الشاغرة
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">المسمى الوظيفي</Label>
                    <Input id="title" placeholder="مثال: مطور برمجيات أول" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="titleEn">المسمى الوظيفي (إنجليزي)</Label>
                    <Input id="titleEn" placeholder="e.g. Senior Software Developer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="department">القسم</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">تقنية المعلومات</SelectItem>
                          <SelectItem value="hr">الموارد البشرية</SelectItem>
                          <SelectItem value="finance">المالية</SelectItem>
                          <SelectItem value="sales">المبيعات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">الموقع</Label>
                      <Input id="location" placeholder="مثال: الرياض" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="jobType">نوع الوظيفة</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(jobTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">مستوى الخبرة</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(experienceLevelLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="salaryMin">الحد الأدنى للراتب</Label>
                      <Input id="salaryMin" type="number" placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salaryMax">الحد الأقصى للراتب</Label>
                      <Input id="salaryMax" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="openPositions">عدد المناصب المطلوبة</Label>
                    <Input id="openPositions" type="number" defaultValue="1" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">وصف الوظيفة</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف تفصيلي للوظيفة..."
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requirements">المتطلبات</Label>
                    <Textarea
                      id="requirements"
                      placeholder="اكتب كل متطلب في سطر منفصل..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">تاريخ إغلاق التقديم</Label>
                    <Input id="deadline" type="date" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => setIsAddSheetOpen(false)}>
                      حفظ كمسودة
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => setIsAddSheetOpen(false)}>
                      نشر الوظيفة
                    </Button>
                  </div>
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
                placeholder="بحث عن وظيفة..."
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
                {Object.entries(jobStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* جدول الوظائف */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الموقع</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المناصب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ النشر</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">لا توجد وظائف</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          {job.titleEn && (
                            <p className="text-xs text-muted-foreground">{job.titleEn}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{job.departmentName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconMapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{jobTypeLabels[job.jobType]}</TableCell>
                      <TableCell>
                        <span className="font-medium">{job.filledPositions}</span>
                        <span className="text-muted-foreground">/{job.openPositions}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={jobStatusColors[job.status]}>
                          {jobStatusLabels[job.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(job.postedDate).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewJob(job)}>
                              <IconEye className="ms-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconEdit className="ms-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <IconTrash className="ms-2 h-4 w-4" />
                              حذف
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

      {/* Sheet عرض تفاصيل الوظيفة */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedJob?.title}</SheetTitle>
            <SheetDescription>{selectedJob?.titleEn}</SheetDescription>
          </SheetHeader>
          {selectedJob && (
            <div className="space-y-6 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={jobStatusColors[selectedJob.status]}>
                  {jobStatusLabels[selectedJob.status]}
                </Badge>
                <Badge variant="outline">{jobTypeLabels[selectedJob.jobType]}</Badge>
                <Badge variant="outline">{experienceLevelLabels[selectedJob.experienceLevel]}</Badge>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedJob.departmentName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedJob.location}</span>
                </div>
                {selectedJob.showSalary && (
                  <div className="flex items-center gap-2 text-sm">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedJob.salaryMin?.toLocaleString()} - {selectedJob.salaryMax?.toLocaleString()} {selectedJob.currency}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedJob.openPositions} منصب متاح</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">الوصف</h4>
                <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">المتطلبات</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">المهارات المطلوبة</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">المزايا</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline">{benefit}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteJobId !== null} onOpenChange={(open) => !open && setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الوظيفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه الوظيفة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
