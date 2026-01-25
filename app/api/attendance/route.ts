/**
 * Attendance API Routes
 * GET /api/attendance - List attendance records
 * POST /api/attendance - Create attendance record (check-in/out)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitAttendance } from "@/lib/attendance/submit-attendance";

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

    if (!body?.employeeId) {
      return NextResponse.json({ error: "employeeId is required" }, { status: 400 });
    }

    if (body.type !== "check-in" && body.type !== "check-out") {
      return NextResponse.json({ error: "type must be check-in or check-out" }, { status: 400 });
    }

    const record = await submitAttendance({
      tenantId,
      employeeId: body.employeeId,
      type: body.type,
      source: body.source || "WEB",
      latitude: body.latitude,
      longitude: body.longitude,
      accuracy: body.accuracy,
      address: body.address,
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    const status = typeof (error as any)?.status === "number" ? (error as any).status : 500;
    const message = typeof (error as any)?.message === "string" ? (error as any).message : "Failed to record attendance";
    if (status >= 500) console.error("Error creating attendance:", error);
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
