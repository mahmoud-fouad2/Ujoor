/**
 * Dashboard Charts Data API
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, year

    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // week
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get attendance data for chart
    const attendanceData = await prisma.attendanceRecord.findMany({
      where: {
        ...where,
        date: { gte: startDate },
      },
      select: {
        date: true,
        status: true,
      },
    });

    // Group attendance by date
    const attendanceByDate: Record<string, { present: number; absent: number; late: number }> = {};
    
    attendanceData.forEach((att: { date: Date; status: string }) => {
      const dateKey = att.date.toISOString().split("T")[0];
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = { present: 0, absent: 0, late: 0 };
      }
      if (att.status === "PRESENT") {
        attendanceByDate[dateKey].present++;
      } else if (att.status === "ABSENT") {
        attendanceByDate[dateKey].absent++;
      } else if (att.status === "LATE") {
        attendanceByDate[dateKey].late++;
      }
    });

    // Get employees by department for pie chart
    const employeesByDepartment = await prisma.department.findMany({
      where,
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    type DepartmentWithCount = typeof employeesByDepartment[number];

    const departmentData = employeesByDepartment
      .filter((dept: DepartmentWithCount) => dept._count.employees > 0)
      .map((dept: DepartmentWithCount) => ({
        name: dept.name,
        nameAr: dept.nameAr,
        value: dept._count.employees,
      }));

    // Get leave distribution
    const leavesByType = await prisma.leaveRequest.groupBy({
      by: ["leaveTypeId"],
      where: {
        ...where,
        status: "APPROVED",
        startDate: { gte: startDate },
      },
      _count: {
        id: true,
      },
    });

    // Get leave type names
    const leaveTypes = await prisma.leaveType.findMany({
      where: { id: { in: leavesByType.map((l) => l.leaveTypeId) } },
    });

    const leaveData = leavesByType.map((item) => {
      const leaveType = leaveTypes.find((lt) => lt.id === item.leaveTypeId);
      return {
        name: leaveType?.name || "Unknown",
        nameAr: leaveType?.nameAr || "غير معروف",
        value: item._count.id,
      };
    });

    return NextResponse.json({
      data: {
        attendance: Object.entries(attendanceByDate).map(([date, counts]) => ({
          date,
          ...counts,
        })),
        departments: departmentData,
        leaves: leaveData,
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
