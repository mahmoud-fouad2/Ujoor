import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// Validation schema
const developmentPlanSchema = z.object({
  employeeId: z.string().min(1, "الموظف مطلوب"),
  title: z.string().min(2, "عنوان الخطة مطلوب"),
  titleAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum([
    "INDIVIDUAL", "TEAM", "ONBOARDING", 
    "PERFORMANCE_IMPROVEMENT", "CAREER_GROWTH", "SKILL_DEVELOPMENT"
  ]).default("INDIVIDUAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  objectives: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    targetDate: z.string().optional(),
    isCompleted: z.boolean().default(false),
    completedAt: z.string().optional().nullable(),
  })).optional().default([]),
  resources: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    url: z.string().optional(),
    description: z.string().optional(),
  })).optional().default([]),
  relatedTrainings: z.array(z.string()).optional().default([]),
  mentorId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// GET - Get all development plans
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { tenantId };
    
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (type) where.type = type;

    // Get plans
    const [plans, total] = await Promise.all([
      prisma.developmentPlan.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              firstNameAr: true,
              lastNameAr: true,
              employeeNumber: true,
              avatar: true,
              department: { select: { name: true, nameAr: true } },
              jobTitle: { select: { name: true, nameAr: true } },
            },
          },
          mentor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              firstNameAr: true,
              lastNameAr: true,
              avatar: true,
            },
          },
        },
        orderBy: [
          { priority: "desc" },
          { endDate: "asc" },
        ],
        skip,
        take: limit,
      }),
      prisma.developmentPlan.count({ where }),
    ]);

    // Stats
    const stats = await prisma.developmentPlan.groupBy({
      by: ["status"],
      where: { tenantId },
      _count: true,
    });

    return NextResponse.json({
      plans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        draft: stats.find((s) => s.status === "DRAFT")?._count || 0,
        pendingApproval: stats.find((s) => s.status === "PENDING_APPROVAL")?._count || 0,
        inProgress: stats.find((s) => s.status === "IN_PROGRESS")?._count || 0,
        completed: stats.find((s) => s.status === "COMPLETED")?._count || 0,
        cancelled: stats.find((s) => s.status === "CANCELLED")?._count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching development plans:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب خطط التطوير" },
      { status: 500 }
    );
  }
}

// POST - Create new development plan
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const body = await request.json();
    
    // Validate
    const validatedData = developmentPlanSchema.parse(body);

    // Verify employee belongs to tenant
    const employee = await prisma.employee.findFirst({
      where: { id: validatedData.employeeId, tenantId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 400 }
      );
    }

    // If mentor specified, verify they belong to tenant
    if (validatedData.mentorId) {
      const mentor = await prisma.employee.findFirst({
        where: { id: validatedData.mentorId, tenantId },
      });
      if (!mentor) {
        return NextResponse.json(
          { error: "المرشد المحدد غير موجود" },
          { status: 400 }
        );
      }
    }

    // Create plan
    const plan = await prisma.developmentPlan.create({
      data: {
        tenantId,
        employeeId: validatedData.employeeId,
        title: validatedData.title,
        titleAr: validatedData.titleAr,
        description: validatedData.description,
        type: validatedData.type,
        priority: validatedData.priority,
        status: "DRAFT",
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        objectives: validatedData.objectives,
        resources: validatedData.resources,
        relatedTrainings: validatedData.relatedTrainings,
        mentorId: validatedData.mentorId,
        notes: validatedData.notes,
        progress: 0,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "تم إنشاء خطة التطوير بنجاح",
      plan,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating development plan:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء خطة التطوير" },
      { status: 500 }
    );
  }
}
