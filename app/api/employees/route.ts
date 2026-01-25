/**
 * Employees API Routes
 * GET /api/employees - List employees
 * POST /api/employees - Create employee
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const departmentId = searchParams.get("departmentId");
    const status = searchParams.get("status");

    const tenantId = session.user.tenantId;

    // Build where clause
    const where: any = {};
    
    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (status) {
      where.status = status;
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          department: true,
          jobTitle: true,
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.employee.count({ where }),
    ]);

    return NextResponse.json({
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
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

    // Generate employee number
    const lastEmployee = await prisma.employee.findFirst({
      where: { tenantId },
      orderBy: { employeeNumber: "desc" },
    });

    const nextNumber = lastEmployee 
      ? String(parseInt(lastEmployee.employeeNumber) + 1).padStart(6, "0")
      : "000001";

    const employee = await prisma.employee.create({
      data: {
        tenantId,
        employeeNumber: nextNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        firstNameAr: body.firstNameAr,
        lastNameAr: body.lastNameAr,
        email: body.email,
        phone: body.phone,
        nationalId: body.nationalId,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        nationality: body.nationality,
        maritalStatus: body.maritalStatus,
        departmentId: body.departmentId,
        jobTitleId: body.jobTitleId,
        managerId: body.managerId,
        hireDate: new Date(body.hireDate),
        employmentType: body.employmentType || "FULL_TIME",
        status: "ACTIVE",
        shiftId: body.shiftId,
        workLocation: body.workLocation,
        baseSalary: body.baseSalary,
      },
      include: {
        department: true,
        jobTitle: true,
      },
    });

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
