/**
 * Dashboard Recent Activities API
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
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    // Get recent activities from multiple sources
    const [recentLeaves, recentAttendance, recentAnnouncements] = await Promise.all([
      // Recent leave requests
      prisma.leaveRequest.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          leaveType: {
            select: {
              name: true,
              nameAr: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      // Recent attendance
      prisma.attendanceRecord.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      // Recent announcements
      prisma.announcement.findMany({
        where: { ...where, isActive: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
    ]);

    // Transform into unified activity format
    const activities: any[] = [];

    // Add leave activities
    recentLeaves.forEach((leave: any) => {
      activities.push({
        id: leave.id,
        type: "LEAVE_REQUEST",
        title: `Leave Request - ${leave.leaveType?.name}`,
        description: `${leave.employee.firstName} ${leave.employee.lastName} requested ${leave.totalDays} days leave`,
        status: leave.status,
        user: leave.employee,
        createdAt: leave.createdAt,
      });
    });

    // Add attendance activities (check-ins/outs)
    recentAttendance.forEach((att: any) => {
      if (att.checkInTime) {
        activities.push({
          id: `${att.id}-in`,
          type: "CHECK_IN",
          title: "Check In",
          description: `${att.employee.firstName} ${att.employee.lastName} checked in`,
          user: att.employee,
          createdAt: att.checkInTime,
        });
      }
      if (att.checkOutTime) {
        activities.push({
          id: `${att.id}-out`,
          type: "CHECK_OUT",
          title: "Check Out",
          description: `${att.employee.firstName} ${att.employee.lastName} checked out`,
          user: att.employee,
          createdAt: att.checkOutTime,
        });
      }
    });

    // Add announcement activities
    recentAnnouncements.forEach((announcement: any) => {
      activities.push({
        id: announcement.id,
        type: "ANNOUNCEMENT",
        title: announcement.title,
        description: announcement.content.substring(0, 100) + (announcement.content.length > 100 ? "..." : ""),
        priority: announcement.priority,
        createdAt: announcement.publishedAt || announcement.createdAt,
      });
    });

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      data: activities.slice(0, limit),
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
