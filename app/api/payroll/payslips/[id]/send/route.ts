/**
 * Payroll Payslip send API
 * POST /api/payroll/payslips/:id/send
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const { id } = await params;

    const existing = await prisma.payrollPayslip.findFirst({
      where: { id, tenantId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.payrollPayslip.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ data: { id: updated.id } });
  } catch (error) {
    console.error("Error sending payslip:", error);
    return NextResponse.json({ error: "Failed to send payslip" }, { status: 500 });
  }
}
