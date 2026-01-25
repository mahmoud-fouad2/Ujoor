"use client";

import { useState, useMemo } from "react";
import {
  IconChevronRight,
  IconChevronLeft,
  IconCalendar,
  IconFilter,
  IconDownload,
  IconBeach,
  IconFirstAidKit,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LeaveCalendarEvent,
  LeaveRequestStatus,
  leaveRequestStatusLabels,
  leaveCategoryLabels,
  mockLeaveRequests,
  leaveTypeColors,
  LeaveCategory,
} from "@/lib/types/leave";
import { mockDepartments } from "@/lib/types/core-hr";

// أسماء الأشهر بالعربية
const monthNames = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

// أسماء الأيام بالعربية
const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function LeaveCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<LeaveRequestStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Convert requests to calendar events
  const calendarEvents: LeaveCalendarEvent[] = useMemo(() => {
    return mockLeaveRequests
      .filter((r) => r.status !== "cancelled" && r.status !== "rejected")
      .map((r) => ({
        id: r.id,
        title: r.employeeName,
        employeeId: r.employeeId,
        employeeName: r.employeeName,
        leaveTypeId: r.leaveTypeId,
        leaveTypeName: r.leaveTypeName,
        category: r.leaveCategory,
        color: leaveTypeColors[r.leaveCategory] || "#6B7280",
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        isHalfDay: r.isHalfDay,
      }));
  }, []);

  // Filter events
  const filteredEvents = calendarEvents.filter((event) => {
    if (filterStatus !== "all" && event.status !== filterStatus) return false;
    // Department filter would need employee data lookup
    return true;
  });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 0, 24)); // Mock today as Jan 24, 2026
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date(2026, 0, 24); // Mock today
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday & Saturday
  };

  // Stats
  const stats = {
    onLeaveToday: filteredEvents.filter((e) => {
      const today = new Date(2026, 0, 24);
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      return today >= start && today <= end && e.status === "taken";
    }).length,
    upcomingLeaves: filteredEvents.filter((e) => {
      const today = new Date(2026, 0, 24);
      const start = new Date(e.startDate);
      return start > today && e.status === "approved";
    }).length,
    pendingApprovals: filteredEvents.filter((e) => e.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تقويم الإجازات</h2>
          <p className="text-muted-foreground">عرض جميع الإجازات في التقويم</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconDownload className="ms-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>في إجازة اليوم</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl text-blue-600">
              <IconBeach className="h-8 w-8" />
              {stats.onLeaveToday}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>إجازات قادمة</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl text-green-600">
              <IconCalendar className="h-8 w-8" />
              {stats.upcomingLeaves}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardDescription>بانتظار الموافقة</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl text-yellow-600">
              <IconUsers className="h-8 w-8" />
              {stats.pendingApprovals}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <IconChevronRight className="h-5 w-5" />
              </Button>
              <h3 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <IconChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                اليوم
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="جميع الأقسام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as LeaveRequestStatus | "all")}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="approved">موافق عليها</SelectItem>
                  <SelectItem value="taken">تم أخذها</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {dayNames.map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center text-sm font-medium ${
                  index === 5 || index === 6 ? "text-red-600" : "text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px rounded-lg border bg-muted">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[120px] bg-background p-2"
                  />
                );
              }

              const events = getEventsForDate(date);
              const weekend = isWeekend(date);
              const today = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[120px] bg-background p-2 transition-colors ${
                    weekend ? "bg-gray-50" : ""
                  } ${today ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  {/* Date Number */}
                  <div
                    className={`mb-1 text-sm font-medium ${
                      today
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        : weekend
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    <TooltipProvider>
                      {events.slice(0, 3).map((event) => (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="truncate rounded px-1.5 py-0.5 text-xs text-white cursor-pointer"
                              style={{ backgroundColor: event.color }}
                            >
                              {event.employeeName}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{event.employeeName}</p>
                              <p className="text-sm">{event.leaveTypeName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.startDate).toLocaleDateString("ar-SA")} -{" "}
                                {new Date(event.endDate).toLocaleDateString("ar-SA")}
                              </p>
                              <Badge
                                variant="outline"
                                className={
                                  event.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : event.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {leaveRequestStatusLabels[event.status]}
                              </Badge>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{events.length - 3} المزيد
                        </div>
                      )}
                    </TooltipProvider>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">دليل الألوان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(leaveTypeColors).slice(0, 8).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">
                  {leaveCategoryLabels[category as LeaveCategory]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Leaves */}
      <Card>
        <CardHeader>
          <CardTitle>في إجازة اليوم</CardTitle>
          <CardDescription>الموظفون الذين في إجازة حالياً</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.onLeaveToday === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا يوجد موظفون في إجازة اليوم
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents
                .filter((e) => {
                  const today = new Date(2026, 0, 24);
                  const start = new Date(e.startDate);
                  const end = new Date(e.endDate);
                  return today >= start && today <= end;
                })
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Avatar>
                      <AvatarFallback>{event.employeeName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{event.employeeName}</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {event.leaveTypeName}
                        </span>
                      </div>
                    </div>
                    <div className="text-start text-sm text-muted-foreground">
                      حتى {new Date(event.endDate).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
