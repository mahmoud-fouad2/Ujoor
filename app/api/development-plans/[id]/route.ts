import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// Validation schema for updates
const planUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  titleAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum([
    "INDIVIDUAL", "TEAM", "ONBOARDING", 
    "PERFORMANCE_IMPROVEMENT", "CAREER_GROWTH", "SKILL_DEVELOPMENT"
  ]).optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  objectives: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    targetDate: z.string().optional(),
    isCompleted: z.boolean().default(false),
    completedAt: z.string().optional().nullable(),
  })).optional(),
  resources: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    url: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  relatedTrainings: z.array(z.string()).optional(),
  mentorId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
});

type Params = Promise<{ id: string }>;

// GET - Get single plan
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const tenantId = session.user.tenantId;

    const plan = await prisma.developmentPlan.findFirst({
      where: { id, tenantId },
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
            email: true,
            department: { select: { name: true, nameAr: true } },
            jobTitle: { select: { name: true, nameAr: true } },
            manager: {
              select: {
                firstName: true,
                lastName: true,
                firstNameAr: true,
                lastNameAr: true,
              },
            },
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
            email: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "خطة التطوير غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الخطة" },
      { status: 500 }
    );
  }
}

// PATCH - Update plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const tenantId = session.user.tenantId;
    const body = await request.json();

    // Check plan exists
    const existingPlan = await prisma.developmentPlan.findFirst({
      where: { id, tenantId },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "خطة التطوير غير موجودة" },
        { status: 404 }
      );
    }

    // Validate
    const validatedData = planUpdateSchema.parse(body);

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

    // Prepare update data
    const updateData: any = { ...validatedData };
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate);
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate);
    }

    // If status changed to COMPLETED, set completedAt
    if (validatedData.status === "COMPLETED" && existingPlan.status !== "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    // Calculate progress from objectives if provided
    if (validatedData.objectives && validatedData.objectives.length > 0) {
      const completedCount = validatedData.objectives.filter((o) => o.isCompleted).length;
      updateData.progress = Math.round((completedCount / validatedData.objectives.length) * 100);
    }

    // Update plan
    const updatedPlan = await prisma.developmentPlan.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
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
      message: "تم تحديث خطة التطوير بنجاح",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الخطة" },
      { status: 500 }
    );
  }
}

// DELETE - Delete plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    // Check permissions
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"];
    if (!allowedRoles.includes(session.user.role || "")) {
      return NextResponse.json(
        { error: "لا تملك صلاحية حذف خطة التطوير" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const tenantId = session.user.tenantId;

    // Check plan exists
    const plan = await prisma.developmentPlan.findFirst({
      where: { id, tenantId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "خطة التطوير غير موجودة" },
        { status: 404 }
      );
    }

    // Cannot delete completed plans
    if (plan.status === "COMPLETED") {
      return NextResponse.json(
        { error: "لا يمكن حذف خطة مكتملة" },
        { status: 400 }
      );
    }

    // Delete plan
    await prisma.developmentPlan.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "تم حذف خطة التطوير بنجاح",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف الخطة" },
      { status: 500 }
    );
  }
}
