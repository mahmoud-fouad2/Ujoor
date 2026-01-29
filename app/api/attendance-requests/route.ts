import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isSuperAdmin(role: string | undefined) {
  return role === "SUPER_ADMIN";
}

const listQuerySchema = z.object({
  employeeId: z.string().optional(),
  status: z.string().optional(),
});

const createSchema = z
  .object({
    employeeId: z.string().min(1),
    type: z.enum(["CHECK_CORRECTION", "OVERTIME", "PERMISSION", "WORK_FROM_HOME"]),
    date: z.string().min(8), // YYYY-MM-DD
    reason: z.string().trim().min(3).max(2000),
    attachmentUrl: z.string().url().optional(),
    requestedCheckIn: z.string().datetime().optional(),
    requestedCheckOut: z.string().datetime().optional(),
    overtimeHours: z.number().min(0).max(24).optional(),
    permissionStartTime: z.string().datetime().optional(),
    permissionEndTime: z.string().datetime().optional(),
  })
  .strict();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = listQuerySchema.safeParse({
      employeeId: searchParams.get("employeeId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const where: any = { tenantId };

    if (parsed.data.employeeId) where.employeeId = parsed.data.employeeId;

    if (parsed.data.status) where.status = String(parsed.data.status).toUpperCase();

    const items = await prisma.attendanceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, firstNameAr: true, lastNameAr: true, userId: true } },
      },
    });

    // Non-super admin users only see their own requests
    if (!isSuperAdmin(session.user.role)) {
      const filtered = items.filter((r) => r.employee.userId === session.user.id);
      return NextResponse.json({ data: { items: filtered } });
    }

    return NextResponse.json({ data: { items } });
  } catch (error) {
    console.error("Error fetching attendance requests:", error);
    return NextResponse.json({ error: "Failed to fetch attendance requests" }, { status: 500 });
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

    const raw = await request.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    // Non-super-admin users can only create for themselves
    if (!isSuperAdmin(session.user.role)) {
      const employee = await prisma.employee.findFirst({
        where: { tenantId, userId: session.user.id },
        select: { id: true },
      });

      if (!employee || employee.id !== parsed.data.employeeId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    const date = new Date(parsed.data.date);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const created = await prisma.attendanceRequest.create({
      data: {
        tenantId,
        employeeId: parsed.data.employeeId,
        type: parsed.data.type,
        status: "PENDING",
        date,
        requestedCheckIn: parsed.data.requestedCheckIn ? new Date(parsed.data.requestedCheckIn) : undefined,
        requestedCheckOut: parsed.data.requestedCheckOut ? new Date(parsed.data.requestedCheckOut) : undefined,
        overtimeHours: parsed.data.overtimeHours,
        permissionStartTime: parsed.data.permissionStartTime ? new Date(parsed.data.permissionStartTime) : undefined,
        permissionEndTime: parsed.data.permissionEndTime ? new Date(parsed.data.permissionEndTime) : undefined,
        reason: parsed.data.reason,
        attachmentUrl: parsed.data.attachmentUrl,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance request:", error);
    return NextResponse.json({ error: "Failed to create attendance request" }, { status: 500 });
  }
}
