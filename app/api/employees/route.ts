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

    // Restrict employee creation to privileged roles
    if (!(["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER"] as const).includes(session.user.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenantId = session.user.tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const body = await request.json();

    if (!body?.firstName || !body?.lastName || !body?.email || !body?.hireDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = body.userId ? String(body.userId) : null;
    if (userId) {
      const user = await prisma.user.findFirst({
        where: { id: userId, tenantId },
        select: { id: true },
      });
      if (!user) {
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
      }

      const alreadyLinked = await prisma.employee.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (alreadyLinked) {
        return NextResponse.json({ error: "User is already linked to an employee" }, { status: 400 });
      }
    }

    // Generate employee number
    // Production data may contain non-numeric employee numbers (e.g. "EMP001-DEMO").
    // Use a fast DB max query when available, but fall back to a JS scan if the DB
    // doesn't support the regex/cast (or if it errors for any reason).
    let nextNumber: string;
    try {
      const maxNumeric = await prisma.$queryRaw<Array<{ max: number | null }>>`
        SELECT MAX(CAST("employeeNumber" AS INT)) as max
        FROM "Employee"
        WHERE "tenantId" = ${tenantId}
          AND "employeeNumber" ~ '^[0-9]+$'
      `;
      const currentMax = maxNumeric?.[0]?.max ?? 0;
      nextNumber = String(currentMax + 1).padStart(6, "0");
    } catch {
      const rows = await prisma.employee.findMany({
        where: { tenantId },
        select: { employeeNumber: true },
        take: 2000,
      });

      let max = 0;
      for (const r of rows) {
        const n = r.employeeNumber;
        if (typeof n === "string" && /^\d+$/.test(n)) {
          const parsed = Number.parseInt(n, 10);
          if (Number.isFinite(parsed) && parsed > max) max = parsed;
        }
      }

      nextNumber = String(max + 1).padStart(6, "0");
    }

    // Avoid rare collisions under concurrency by retrying a few numbers forward.
    let employee = null as any;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = String(Number.parseInt(nextNumber, 10) + attempt).padStart(6, "0");
      try {
        employee = await prisma.employee.create({
          data: {
            tenantId,
            userId: userId ?? undefined,
            employeeNumber: candidate,
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
        break;
      } catch (e: any) {
        // Unique constraint collision on (tenantId, employeeNumber)
        if (e?.code === "P2002") continue;
        throw e;
      }
    }

    if (!employee) {
      return NextResponse.json({ error: "Failed to allocate employee number" }, { status: 500 });
    }

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
