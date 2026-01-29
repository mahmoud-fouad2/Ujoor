/**
 * Leave Balances API Routes
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isSuperAdmin(role: string | undefined) {
  return role === "SUPER_ADMIN";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedTenantId = searchParams.get("tenantId") ?? undefined;
    const employeeId = searchParams.get("employeeId") ?? undefined;
    const departmentId = searchParams.get("departmentId") ?? undefined;
    const leaveTypeId = searchParams.get("leaveTypeId") ?? undefined;
    const yearParam = searchParams.get("year") ?? undefined;

    const tenantId = isSuperAdmin(session.user.role)
      ? requestedTenantId ?? session.user.tenantId
      : session.user.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    const where: any = { tenantId, year };
    if (employeeId) where.employeeId = employeeId;
    if (leaveTypeId) where.leaveTypeId = leaveTypeId;
    if (departmentId) {
      where.employee = { departmentId };
    }

    const items = await prisma.leaveBalance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            departmentId: true,
            department: { select: { name: true } },
          },
        },
        leaveType: true,
      },
      orderBy: [{ employee: { firstName: "asc" } }, { leaveType: { name: "asc" } }],
    });

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("Error fetching leave balances:", error);
    return NextResponse.json({ error: "Failed to fetch leave balances" }, { status: 500 });
  }
}
