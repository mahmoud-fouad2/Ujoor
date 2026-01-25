/**
 * Dashboard Stats API
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    // Get counts in parallel
    const [
      totalEmployees,
      activeEmployees,
      departments,
      todayAttendance,
      pendingLeaves,
      onLeaveToday,
      newHiresThisMonth,
    ] = await Promise.all([
      // Total employees
      prisma.employee.count({
        where,
      }),
      // Active employees
      prisma.employee.count({
        where: { ...where, status: "ACTIVE" },
      }),
      // Departments count
      prisma.department.count({
        where,
      }),
      // Today's attendance
      prisma.attendanceRecord.count({
        where: {
          ...where,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Pending leave requests
      prisma.leaveRequest.count({
        where: { ...where, status: "PENDING" },
      }),
      // On leave today
      prisma.leaveRequest.count({
        where: {
          ...where,
          status: "APPROVED",
          startDate: { lte: today },
          endDate: { gte: today },
        },
      }),
      // New hires this month
      prisma.employee.count({
        where: {
          ...where,
          hireDate: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1),
          },
        },
      }),
    ]);

    // Calculate attendance rate
    const attendanceRate = activeEmployees > 0 
      ? Math.round((todayAttendance / activeEmployees) * 100) 
      : 0;

    return NextResponse.json({
      data: {
        totalEmployees,
        activeEmployees,
        departments,
        todayAttendance,
        attendanceRate,
        pendingLeaves,
        onLeaveToday,
        newHiresThisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
