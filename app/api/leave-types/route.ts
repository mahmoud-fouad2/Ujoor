/**
 * Leave Types API Routes
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

    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const leaveTypes = await prisma.leaveType.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: leaveTypes });
  } catch (error) {
    console.error("Error fetching leave types:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave types" },
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

    const leaveType = await prisma.leaveType.create({
      data: {
        tenantId,
        name: body.name,
        nameAr: body.nameAr,
        code: body.code,
        description: body.description,
        defaultDays: body.defaultDays || 0,
        maxDays: body.maxDays,
        carryOverDays: body.carryOverDays || 0,
        carryOverExpiry: body.carryOverExpiry,
        isPaid: body.isPaid ?? true,
        requiresApproval: body.requiresApproval ?? true,
        requiresAttachment: body.requiresAttachment ?? false,
        minServiceMonths: body.minServiceMonths || 0,
        applicableGenders: body.applicableGenders || [],
        color: body.color || "#3B82F6",
        isActive: true,
      },
    });

    return NextResponse.json({ data: leaveType }, { status: 201 });
  } catch (error) {
    console.error("Error creating leave type:", error);
    return NextResponse.json(
      { error: "Failed to create leave type" },
      { status: 500 }
    );
  }
}
