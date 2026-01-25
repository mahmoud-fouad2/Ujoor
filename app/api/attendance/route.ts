/**
 * Attendance API Routes
 * GET /api/attendance - List attendance records
 * POST /api/attendance - Create attendance record (check-in/out)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const employeeId = searchParams.get("employeeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    const tenantId = session.user.tenantId;

    const where: any = {};
    
    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          shift: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.attendanceRecord.count({ where }),
    ]);

    return NextResponse.json({
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const body = await request.json();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find or create today's attendance record
    let record = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: body.employeeId,
        date: today,
      },
    });

    if (body.type === "check-in") {
      if (record && record.checkInTime) {
        return NextResponse.json(
          { error: "Already checked in today" },
          { status: 400 }
        );
      }

      if (record) {
        record = await prisma.attendanceRecord.update({
          where: { id: record.id },
          data: {
            checkInTime: now,
            checkInSource: body.source || "WEB",
            checkInLat: body.latitude,
            checkInLng: body.longitude,
            checkInAddress: body.address,
            status: "PRESENT",
          },
        });
      } else {
        record = await prisma.attendanceRecord.create({
          data: {
            tenantId,
            employeeId: body.employeeId,
            date: today,
            checkInTime: now,
            checkInSource: body.source || "WEB",
            checkInLat: body.latitude,
            checkInLng: body.longitude,
            checkInAddress: body.address,
            status: "PRESENT",
          },
        });
      }
    } else if (body.type === "check-out") {
      if (!record || !record.checkInTime) {
        return NextResponse.json(
          { error: "Must check in first" },
          { status: 400 }
        );
      }

      if (record.checkOutTime) {
        return NextResponse.json(
          { error: "Already checked out today" },
          { status: 400 }
        );
      }

      // Calculate work duration
      const checkInTime = new Date(record.checkInTime);
      const totalMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000);

      record = await prisma.attendanceRecord.update({
        where: { id: record.id },
        data: {
          checkOutTime: now,
          checkOutSource: body.source || "WEB",
          checkOutLat: body.latitude,
          checkOutLng: body.longitude,
          checkOutAddress: body.address,
          totalWorkMinutes: totalMinutes,
        },
      });
    }

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}
