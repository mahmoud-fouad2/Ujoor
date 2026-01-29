/**
 * Payroll Payslips API (MVP)
 * GET  /api/payroll/payslips?periodId=...&status=...&q=...
 * POST /api/payroll/payslips  (send all for a period)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Payslip, PayslipDeduction, PayslipEarning, PayslipStatus } from "@/lib/types/payroll";
import { Prisma } from "@prisma/client";

function toIsoDateTime(d: Date) {
  return d.toISOString();
}

function toIsoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function roundInt(n: number) {
  return Math.round(n);
}

function computePayslipSnapshot(input: {
  employee: {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    firstNameAr: string | null;
    lastNameAr: string | null;
    baseSalary: number;
    currency: string;
    department: { name: string; nameAr: string | null } | null;
    jobTitle: { name: string; nameAr: string | null } | null;
  };
  period: { id: string; startDate: Date; endDate: Date; paymentDate: Date };
}): Omit<Payslip, "id" | "createdAt" | "updatedAt" | "status" | "sentAt" | "viewedAt"> & {
  status: PayslipStatus;
  createdAt: string;
  updatedAt: string;
} {
  const basicSalary = input.employee.baseSalary;
  const housingAllowance = basicSalary * 0.25;
  const transportAllowance = basicSalary * 0.1;
  const totalEarnings = basicSalary + housingAllowance + transportAllowance;

  const gosiBase = basicSalary + housingAllowance;
  const gosiEmployee = roundInt(gosiBase * 0.0975);
  const gosiEmployer = roundInt(gosiBase * 0.1175);

  const totalDeductions = gosiEmployee;
  const netSalary = totalEarnings - totalDeductions;

  const earnings: PayslipEarning[] = [
    {
      type: "basic",
      name: "Basic Salary",
      nameAr: "الراتب الأساسي",
      amount: basicSalary,
    },
    {
      type: "housing",
      name: "Housing Allowance",
      nameAr: "بدل السكن",
      amount: housingAllowance,
    },
    {
      type: "transport",
      name: "Transport Allowance",
      nameAr: "بدل المواصلات",
      amount: transportAllowance,
    },
  ];

  const deductions: PayslipDeduction[] = [
    {
      type: "gosi",
      name: "GOSI",
      nameAr: "التأمينات الاجتماعية",
      amount: gosiEmployee,
    },
  ];

  const nowIso = toIsoDateTime(new Date());

  return {
    payrollPeriodId: input.period.id,
    employeeId: input.employee.id,
    employeeName: `${input.employee.firstName} ${input.employee.lastName}`,
    employeeNameAr: `${input.employee.firstNameAr || input.employee.firstName} ${input.employee.lastNameAr || input.employee.lastName}`,
    employeeNumber: input.employee.employeeNumber,
    department: input.employee.department?.name ?? "N/A",
    departmentAr: input.employee.department?.nameAr ?? "غير محدد",
    jobTitle: input.employee.jobTitle?.name ?? "N/A",
    jobTitleAr: input.employee.jobTitle?.nameAr ?? "غير محدد",
    basicSalary,
    earnings,
    totalEarnings,
    deductions,
    totalDeductions,
    netSalary,
    workingDays: 22,
    actualWorkDays: 22,
    absentDays: 0,
    lateDays: 0,
    overtimeHours: 0,
    gosiEmployee,
    gosiEmployer,
    status: "generated",
    paymentMethod: "bank_transfer",
    bankName: undefined,
    accountNumber: undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

function mapDbPayslip(row: any): Payslip {
  const employee = row.employee;
  return {
    id: row.id,
    payrollPeriodId: row.payrollPeriodId,
    employeeId: row.employeeId,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    employeeNameAr: `${employee.firstNameAr || employee.firstName} ${employee.lastNameAr || employee.lastName}`,
    employeeNumber: employee.employeeNumber,
    department: employee.department?.name ?? "N/A",
    departmentAr: employee.department?.nameAr ?? "غير محدد",
    jobTitle: employee.jobTitle?.name ?? "N/A",
    jobTitleAr: employee.jobTitle?.nameAr ?? "غير محدد",
    basicSalary: Number(row.basicSalary),
    earnings: row.earnings as PayslipEarning[],
    totalEarnings: Number(row.totalEarnings),
    deductions: row.deductions as PayslipDeduction[],
    totalDeductions: Number(row.totalDeductions),
    netSalary: Number(row.netSalary),
    workingDays: row.workingDays,
    actualWorkDays: row.actualWorkDays,
    absentDays: row.absentDays,
    lateDays: row.lateDays,
    overtimeHours: row.overtimeHours,
    gosiEmployee: row.gosiEmployee,
    gosiEmployer: row.gosiEmployer,
    status: String(row.status).toLowerCase() as PayslipStatus,
    sentAt: row.sentAt ? toIsoDateTime(row.sentAt) : undefined,
    viewedAt: row.viewedAt ? toIsoDateTime(row.viewedAt) : undefined,
    paymentMethod: row.paymentMethod,
    bankName: row.bankName ?? undefined,
    accountNumber: row.accountNumber ?? undefined,
    createdAt: toIsoDateTime(row.createdAt),
    updatedAt: toIsoDateTime(row.updatedAt),
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

    const url = new URL(request.url);
    const periodId = url.searchParams.get("periodId") || "";
    const status = (url.searchParams.get("status") || "").toLowerCase();
    const q = (url.searchParams.get("q") || "").trim();

    if (!periodId) {
      return NextResponse.json({ error: "periodId is required" }, { status: 400 });
    }

    const period = await prisma.payrollPeriod.findFirst({
      where: { id: periodId, tenantId },
      select: { id: true, startDate: true, endDate: true, paymentDate: true },
    });

    if (!period) {
      return NextResponse.json({ error: "Payroll period not found" }, { status: 404 });
    }

    // Ensure payslips exist for the period (idempotent generation)
    const existingCount = await prisma.payrollPayslip.count({
      where: { tenantId, payrollPeriodId: periodId },
    });

    if (existingCount === 0) {
      const employees = await prisma.employee.findMany({
        where: { tenantId, status: "ACTIVE" },
        select: {
          id: true,
          employeeNumber: true,
          firstName: true,
          lastName: true,
          firstNameAr: true,
          lastNameAr: true,
          baseSalary: true,
          currency: true,
          department: { select: { name: true, nameAr: true } },
          jobTitle: { select: { name: true, nameAr: true } },
        },
      });

      await prisma.$transaction(
        employees.map((employee) => {
          const snapshot = computePayslipSnapshot({
            employee: {
              ...employee,
              baseSalary: Number(employee.baseSalary ?? 0),
              currency: employee.currency,
            },
            period,
          });

          return prisma.payrollPayslip.upsert({
            where: {
              tenantId_payrollPeriodId_employeeId: {
                tenantId,
                payrollPeriodId: periodId,
                employeeId: employee.id,
              },
            },
            create: {
              tenantId,
              payrollPeriodId: periodId,
              employeeId: employee.id,
              status: "GENERATED",
              currency: employee.currency,
              paymentMethod: "bank_transfer",
              bankName: null,
              accountNumber: null,
              basicSalary: snapshot.basicSalary,
              totalEarnings: snapshot.totalEarnings,
              totalDeductions: snapshot.totalDeductions,
              netSalary: snapshot.netSalary,
              earnings: snapshot.earnings as unknown as Prisma.InputJsonValue,
              deductions: snapshot.deductions as unknown as Prisma.InputJsonValue,
              workingDays: snapshot.workingDays,
              actualWorkDays: snapshot.actualWorkDays,
              absentDays: snapshot.absentDays,
              lateDays: snapshot.lateDays,
              overtimeHours: snapshot.overtimeHours,
              gosiEmployee: snapshot.gosiEmployee,
              gosiEmployer: snapshot.gosiEmployer,
            },
            update: {},
          });
        })
      );
    }

    const where: any = { tenantId, payrollPeriodId: periodId };

    if (status && status !== "all") {
      const upper = status.toUpperCase();
      if (["DRAFT", "GENERATED", "SENT", "VIEWED"].includes(upper)) {
        where.status = upper;
      }
    }

    if (q) {
      where.employee = {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { firstNameAr: { contains: q, mode: "insensitive" } },
          { lastNameAr: { contains: q, mode: "insensitive" } },
          { employeeNumber: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const rows = await prisma.payrollPayslip.findMany({
      where,
      include: {
        employee: {
          select: {
            employeeNumber: true,
            firstName: true,
            lastName: true,
            firstNameAr: true,
            lastNameAr: true,
            department: { select: { name: true, nameAr: true } },
            jobTitle: { select: { name: true, nameAr: true } },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({
      data: {
        period: {
          id: period.id,
          startDate: toIsoDate(period.startDate),
          endDate: toIsoDate(period.endDate),
          paymentDate: toIsoDate(period.paymentDate),
        },
        payslips: rows.map(mapDbPayslip),
      },
    });
  } catch (error) {
    console.error("Error loading payslips:", error);
    return NextResponse.json({ error: "Failed to load payslips" }, { status: 500 });
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

    const body = (await request.json().catch(() => null)) as
      | { periodId?: string }
      | null;

    const periodId = body?.periodId || "";
    if (!periodId) {
      return NextResponse.json({ error: "periodId is required" }, { status: 400 });
    }

    const period = await prisma.payrollPeriod.findFirst({
      where: { id: periodId, tenantId },
      select: { id: true },
    });

    if (!period) {
      return NextResponse.json({ error: "Payroll period not found" }, { status: 404 });
    }

    const updated = await prisma.payrollPayslip.updateMany({
      where: {
        tenantId,
        payrollPeriodId: periodId,
        status: { in: ["DRAFT", "GENERATED"] },
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ data: { updatedCount: updated.count } });
  } catch (error) {
    console.error("Error sending payslips:", error);
    return NextResponse.json({ error: "Failed to send payslips" }, { status: 500 });
  }
}
