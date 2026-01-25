/**
 * Departments API Routes
 * GET /api/departments - List departments
 * POST /api/departments - Create department
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

    const departments = await prisma.department.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
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

    const department = await prisma.department.create({
      data: {
        tenantId,
        name: body.name,
        nameAr: body.nameAr,
        code: body.code,
        description: body.description,
        parentId: body.parentId,
        managerId: body.managerId,
        isActive: true,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: department }, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
