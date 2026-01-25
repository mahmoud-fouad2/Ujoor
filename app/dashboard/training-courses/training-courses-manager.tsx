"use client";

import * as React from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconBook,
  IconUsers,
  IconClock,
  IconCalendar,
  IconCertificate,
  IconStar,
  IconStarFilled,
  IconMapPin,
  IconVideo,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  TrainingCourse,
  CourseStatus,
  CourseType,
  CourseCategory,
  courseStatusLabels,
  courseStatusColors,
  courseTypeLabels,
  courseCategoryLabels,
  mockCourses,
  mockTrainingStats,
} from "@/lib/types/training";

export function TrainingCoursesManager() {
  const [courses, setCourses] = React.useState<TrainingCourse[]>(mockCourses);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<TrainingCourse | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false);

  // فلترة الدورات
  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, searchQuery, statusFilter, categoryFilter]);

  // إحصائيات
  const stats = mockTrainingStats;

  const handleViewCourse = (course: TrainingCourse) => {
    setSelectedCourse(course);
    setIsViewSheetOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدورة؟")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const renderRating = (rating: number | undefined) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.floor(rating) ? (
              <IconStarFilled className="h-3 w-3 text-yellow-500" />
            ) : (
              <IconStar className="h-3 w-3 text-yellow-500" />
            )}
          </span>
        ))}
        <span className="text-xs text-muted-foreground me-1">({rating})</span>
      </div>
    );
  };

  const getCourseTypeIcon = (type: CourseType) => {
    switch (type) {
      case "online":
        return <IconVideo className="h-4 w-4" />;
      case "in-person":
        return <IconMapPin className="h-4 w-4" />;
      default:
        return <IconBook className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">{stats.activeCourses} دورة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المسجلون</CardTitle>
            <IconUsers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">{stats.completedEnrollments} أتموا التدريب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ساعات التدريب</CardTitle>
            <IconClock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalHoursCompleted}</div>
            <p className="text-xs text-muted-foreground">ساعة مكتملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">معدل الشهادات</CardTitle>
            <IconCertificate className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.certificationRate}%</div>
            <p className="text-xs text-muted-foreground">حصلوا على شهادات</p>
          </CardContent>
        </Card>
      </div>

      {/* ميزانية التدريب */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">ميزانية التدريب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={(stats.budgetUsed / stats.budgetTotal) * 100} className="h-3 flex-1" />
            <span className="text-sm font-medium">
              {stats.budgetUsed.toLocaleString()} / {stats.budgetTotal.toLocaleString()} ر.س
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            تم استخدام {Math.round((stats.budgetUsed / stats.budgetTotal) * 100)}% من الميزانية
          </p>
        </CardContent>
      </Card>

      {/* قائمة الدورات */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>الدورات التدريبية</CardTitle>
              <CardDescription>إدارة الدورات والبرامج التدريبية</CardDescription>
            </div>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <IconPlus className="ms-2 h-4 w-4" />
                  إضافة دورة
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>إضافة دورة تدريبية جديدة</SheetTitle>
                  <SheetDescription>
                    أدخل تفاصيل الدورة التدريبية
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">عنوان الدورة</Label>
                    <Input id="title" placeholder="مثال: مهارات التواصل الفعّال" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="titleEn">العنوان بالإنجليزية</Label>
                    <Input id="titleEn" placeholder="e.g. Effective Communication Skills" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">التصنيف</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(courseCategoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">نوع الدورة</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(courseTypeLabels).map(([value, label]) => (
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
                      <Label htmlFor="duration">المدة (ساعات)</Label>
                      <Input id="duration" type="number" placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
                      <Input id="maxParticipants" type="number" placeholder="20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">تاريخ البدء</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instructor">المدرب</Label>
                    <Input id="instructor" placeholder="اسم المدرب" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">المكان / رابط الاجتماع</Label>
                    <Input id="location" placeholder="قاعة التدريب أو رابط Zoom" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">وصف الدورة</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف تفصيلي للدورة..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="objectives">أهداف الدورة</Label>
                    <Textarea
                      id="objectives"
                      placeholder="اكتب كل هدف في سطر منفصل..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => setIsAddSheetOpen(false)}>
                      حفظ كمسودة
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => setIsAddSheetOpen(false)}>
                      نشر الدورة
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
                placeholder="بحث عن دورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {Object.entries(courseCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <IconFilter className="ms-2 h-4 w-4" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(courseStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* جدول الدورات */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الدورة</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>المشاركون</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">لا توجد دورات</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          {course.titleEn && (
                            <p className="text-xs text-muted-foreground">{course.titleEn}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {courseCategoryLabels[course.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getCourseTypeIcon(course.type)}
                          <span className="text-sm">{courseTypeLabels[course.type]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{course.duration} ساعة</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{course.currentParticipants}</span>
                        {course.maxParticipants && (
                          <span className="text-muted-foreground">/{course.maxParticipants}</span>
                        )}
                      </TableCell>
                      <TableCell>{renderRating(course.rating)}</TableCell>
                      <TableCell>
                        <Badge className={courseStatusColors[course.status]}>
                          {courseStatusLabels[course.status]}
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
                            <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                              <IconEye className="ms-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconEdit className="ms-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconUsers className="ms-2 h-4 w-4" />
                              المشاركون
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteCourse(course.id)}
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

      {/* Sheet عرض تفاصيل الدورة */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCourse?.title}</SheetTitle>
            <SheetDescription>{selectedCourse?.titleEn}</SheetDescription>
          </SheetHeader>
          {selectedCourse && (
            <div className="space-y-6 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={courseStatusColors[selectedCourse.status]}>
                  {courseStatusLabels[selectedCourse.status]}
                </Badge>
                <Badge variant="outline">
                  {courseCategoryLabels[selectedCourse.category]}
                </Badge>
                <Badge variant="outline">
                  {courseTypeLabels[selectedCourse.type]}
                </Badge>
                {selectedCourse.isMandatory && (
                  <Badge variant="destructive">إلزامي</Badge>
                )}
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCourse.duration} ساعة</span>
                </div>
                {selectedCourse.startDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedCourse.startDate).toLocaleDateString("ar-SA")}
                      {selectedCourse.endDate && ` - ${new Date(selectedCourse.endDate).toLocaleDateString("ar-SA")}`}
                    </span>
                  </div>
                )}
                {selectedCourse.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCourse.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedCourse.currentParticipants}
                    {selectedCourse.maxParticipants && ` / ${selectedCourse.maxParticipants}`} مشارك
                  </span>
                </div>
              </div>

              {selectedCourse.instructor && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">المدرب</h4>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedCourse.instructor.avatar} />
                        <AvatarFallback>
                          {selectedCourse.instructor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedCourse.instructor.name}</p>
                        {selectedCourse.instructor.title && (
                          <p className="text-sm text-muted-foreground">{selectedCourse.instructor.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">الوصف</h4>
                <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
              </div>

              {selectedCourse.objectives.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">أهداف الدورة</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedCourse.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCourse.certificate && (
                <div>
                  <h4 className="font-semibold mb-2">الشهادة</h4>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <IconCertificate className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedCourse.certificate.name}</span>
                    </div>
                    {selectedCourse.certificate.validityPeriod && (
                      <p className="text-sm text-muted-foreground mt-1">
                        صالحة لمدة {selectedCourse.certificate.validityPeriod} شهر
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <IconUsers className="ms-2 h-4 w-4" />
                  إدارة المشاركين
                </Button>
                <Button variant="outline" className="flex-1">
                  <IconEdit className="ms-2 h-4 w-4" />
                  تعديل الدورة
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
