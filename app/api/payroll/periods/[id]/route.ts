/**
 * Payroll Period API
 * GET /api/payroll/periods/:id
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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const { id } = await params;

    const period = await prisma.payrollPeriod.findFirst({
      where: { id, tenantId },
    });

    if (!period) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mapPeriod(period) });
  } catch (error) {
    console.error("Error fetching payroll period:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll period" },
      { status: 500 }
    );
  }
}
