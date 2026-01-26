/**
 * Payroll Periods API
 * GET /api/payroll/periods - List payroll periods
 * POST /api/payroll/periods - Create payroll period
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

    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const month = searchParams.get("month") ? Number(searchParams.get("month")) : undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = { tenantId };

    if (status) {
      where.status = String(status).toUpperCase();
    }

    if (year && month) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0));
      where.startDate = { gte: start, lte: end };
    } else if (year) {
      const start = new Date(Date.UTC(year, 0, 1));
      const end = new Date(Date.UTC(year, 11, 31));
      where.startDate = { gte: start, lte: end };
    }

    const periods = await prisma.payrollPeriod.findMany({
      where,
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: periods.map(mapPeriod) });
  } catch (error) {
    console.error("Error fetching payroll periods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll periods" },
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

    for (const key of ["name", "nameAr", "startDate", "endDate", "paymentDate"]) {
      if (!body?.[key]) {
        return NextResponse.json({ error: `${key} is required` }, { status: 400 });
      }
    }

    const period = await prisma.payrollPeriod.create({
      data: {
        tenantId,
        name: body.name,
        nameAr: body.nameAr,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        paymentDate: new Date(body.paymentDate),
        status: "DRAFT",
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        employeeCount: 0,
      },
    });

    return NextResponse.json({ data: mapPeriod(period) }, { status: 201 });
  } catch (error) {
    console.error("Error creating payroll period:", error);
    return NextResponse.json(
      { error: "Failed to create payroll period" },
      { status: 500 }
    );
  }
}
