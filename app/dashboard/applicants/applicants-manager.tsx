"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconMail,
  IconPhone,
  IconCalendar,
  IconStar,
  IconStarFilled,
  IconUser,
  IconBriefcase,
  IconFileText,
  IconExternalLink,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Applicant,
  JobPosting,
  ApplicationStatus,
  applicationStatusLabels,
  applicationStatusColors,
  sourceChannelLabels,
} from "@/lib/types/recruitment";
import { getApplicants, getJobPostings } from "@/lib/api/recruitment";

export function ApplicantsManager() {
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [jobs, setJobs] = React.useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [jobFilter, setJobFilter] = React.useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [applicantsRes, jobsRes] = await Promise.all([
          getApplicants(),
          getJobPostings(),
        ]);
        if (!isMounted) return;
        setApplicants(applicantsRes);
        setJobs(jobsRes);
      } catch {
        if (!isMounted) return;
        setApplicants([]);
        setJobs([]);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  // فلترة المتقدمين
  const filteredApplicants = React.useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || applicant.status === statusFilter;

      const matchesJob =
        jobFilter === "all" || applicant.jobPostingId === jobFilter;

      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applicants, searchQuery, statusFilter, jobFilter]);

  // إحصائيات
  const stats = React.useMemo(() => ({
    total: applicants.length,
    new: applicants.filter((a) => a.status === "new").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    hired: applicants.filter((a) => a.status === "hired").length,
  }), [applicants]);

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsViewSheetOpen(true);
  };

  const handleStatusChange = (applicantId: string, newStatus: ApplicationStatus) => {
    setApplicants(
      applicants.map((a) =>
        a.id === applicantId ? { ...a, status: newStatus } : a
      )
    );
  };

  const handleRatingChange = (applicantId: string, rating: number) => {
    setApplicants(
      applicants.map((a) =>
        a.id === applicantId ? { ...a, rating } : a
      )
    );
  };

  const renderStars = (rating: number | undefined, applicantId: string) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(applicantId, star)}
            className="text-yellow-500 hover:scale-110 transition-transform"
          >
            {rating && star <= rating ? (
              <IconStarFilled className="h-4 w-4" />
            ) : (
              <IconStar className="h-4 w-4" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المتقدمين</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">متقدم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طلبات جديدة</CardTitle>
            <IconFileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">بانتظار المراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">في المقابلات</CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.interview}</div>
            <p className="text-xs text-muted-foreground">قيد التقييم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تم توظيفهم</CardTitle>
            <IconBriefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
            <p className="text-xs text-muted-foreground">موظف جديد</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول المتقدمين */}
      <Card>
        <CardHeader>
          <CardTitle>المتقدمون للوظائف</CardTitle>
          <CardDescription>قائمة بجميع المتقدمين وحالة طلباتهم</CardDescription>
        </CardHeader>
        <CardContent>
          {/* أدوات البحث والفلترة */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="relative flex-1">
              <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث عن متقدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="الوظيفة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الوظائف</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <IconFilter className="ms-2 h-4 w-4" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(applicationStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* جدول المتقدمين */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المتقدم</TableHead>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">لا يوجد متقدمون</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {applicant.firstName[0]}{applicant.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {applicant.firstName} {applicant.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {applicant.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{applicant.jobTitle}</p>
                          {applicant.currentCompany && (
                            <p className="text-xs text-muted-foreground">
                              حالياً: {applicant.currentCompany}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sourceChannelLabels[applicant.source]}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderStars(applicant.rating, applicant.id)}</TableCell>
                      <TableCell>
                        <Select
                          value={applicant.status}
                          onValueChange={(value) =>
                            handleStatusChange(applicant.id, value as ApplicationStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-28">
                            <Badge className={applicationStatusColors[applicant.status]}>
                              {applicationStatusLabels[applicant.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(applicationStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <Badge className={applicationStatusColors[value as ApplicationStatus]}>
                                  {label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(applicant.appliedAt).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewApplicant(applicant)}>
                              <IconEye className="ms-2 h-4 w-4" />
                              عرض الملف
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconMail className="ms-2 h-4 w-4" />
                              إرسال بريد
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconCalendar className="ms-2 h-4 w-4" />
                              جدولة مقابلة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              رفض الطلب
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

      {/* Sheet عرض تفاصيل المتقدم */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>ملف المتقدم</SheetTitle>
            <SheetDescription>معلومات تفصيلية عن المتقدم</SheetDescription>
          </SheetHeader>
          {selectedApplicant && (
            <div className="space-y-6 py-4">
              {/* معلومات أساسية */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedApplicant.firstName[0]}{selectedApplicant.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedApplicant.currentPosition}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplicant.currentCompany}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={applicationStatusColors[selectedApplicant.status]}>
                      {applicationStatusLabels[selectedApplicant.status]}
                    </Badge>
                    {renderStars(selectedApplicant.rating, selectedApplicant.id)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* معلومات الاتصال */}
              <div>
                <h4 className="font-semibold mb-3">معلومات الاتصال</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedApplicant.email}`} className="text-primary hover:underline">
                      {selectedApplicant.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedApplicant.phone}`} className="hover:underline">
                      {selectedApplicant.phone}
                    </a>
                  </div>
                  {selectedApplicant.linkedinUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a href={selectedApplicant.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* تفاصيل الوظيفة */}
              <div>
                <h4 className="font-semibold mb-3">الوظيفة المتقدم لها</h4>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium">{selectedApplicant.jobTitle}</p>
                  <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                    <span>المصدر: {sourceChannelLabels[selectedApplicant.source]}</span>
                    {selectedApplicant.referredBy && (
                      <span>• ترشيح من موظف</span>
                    )}
                  </div>
                </div>
              </div>

              {/* الخبرة والتعليم */}
              <div>
                <h4 className="font-semibold mb-3">المؤهلات</h4>
                <div className="space-y-2 text-sm">
                  {selectedApplicant.yearsOfExperience && (
                    <p>• {selectedApplicant.yearsOfExperience} سنوات خبرة</p>
                  )}
                  {selectedApplicant.education && (
                    <p>• {selectedApplicant.education}</p>
                  )}
                  {selectedApplicant.expectedSalary && (
                    <p>• الراتب المتوقع: {selectedApplicant.expectedSalary.toLocaleString()} ر.س</p>
                  )}
                </div>
              </div>

              {/* المهارات */}
              {selectedApplicant.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">المهارات</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* الإجراءات */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <IconCalendar className="ms-2 h-4 w-4" />
                  جدولة مقابلة
                </Button>
                <Button variant="outline" className="flex-1">
                  <IconMail className="ms-2 h-4 w-4" />
                  إرسال رسالة
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
