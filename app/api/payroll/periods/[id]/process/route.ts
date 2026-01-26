/**
 * Payroll Period Processing API
 * POST /api/payroll/periods/:id/process - Calculate payroll totals (MVP)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function toIsoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function mapPeriod(period: any) {
  return {
    ...period,
    startDate: toIsoDate(period.startDate),
    endDate: toIsoDate(period.endDate),
    paymentDate: toIsoDate(period.paymentDate),
    status: String(period.status).toLowerCase(),
    totalGross: Number(period.totalGross),
    totalDeductions: Number(period.totalDeductions),
    totalNet: Number(period.totalNet),
  };
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const userId = session.user.id;
    const { id } = await params;

    const existing = await prisma.payrollPeriod.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const employees = await prisma.employee.findMany({
      where: { tenantId, status: "ACTIVE" },
      select: { baseSalary: true },
    });

    const totalGross = employees.reduce((sum, e) => sum + Number(e.baseSalary ?? 0), 0);

    const updated = await prisma.payrollPeriod.update({
      where: { id },
      data: {
        status: "PENDING_APPROVAL",
        employeeCount: employees.length,
        totalGross,
        totalDeductions: 0,
        totalNet: totalGross,
        processedById: userId,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ data: mapPeriod(updated) });
  } catch (error) {
    console.error("Error processing payroll period:", error);
    return NextResponse.json(
      { error: "Failed to process payroll period" },
      { status: 500 }
    );
  }
}
