/**
 * Admin Tenant Detail API Routes - Super Admin Only
 * /api/admin/tenants/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Tenant, TenantStatus } from "@/lib/types/tenant";

function mapPlanFromDb(plan: unknown): Tenant["plan"] {
  const v = String(plan ?? "").toUpperCase();
  if (v === "ENTERPRISE") return "enterprise";
  if (v === "PROFESSIONAL" || v === "BUSINESS") return "business";
  if (v === "BASIC" || v === "STARTER" || v === "TRIAL") return "starter";
  const lower = String(plan ?? "").toLowerCase();
  if (lower === "enterprise" || lower === "business" || lower === "starter") return lower as Tenant["plan"];
  return "starter";
}

// Map DB tenant to client format
function mapTenant(t: any): Tenant {
  return {
    id: t.id,
    name: t.name,
    nameAr: t.nameAr ?? t.name,
    slug: t.slug,
    status: (t.status?.toLowerCase() ?? "pending") as TenantStatus,
    plan: mapPlanFromDb(t.plan),
    email: t.email ?? "",
    country: t.country ?? "SA",
    defaultLocale: t.defaultLocale ?? "ar",
    defaultTheme: t.defaultTheme ?? "shadcn",
    timezone: t.timezone ?? "Asia/Riyadh",
    usersCount: t._count?.users ?? 0,
    employeesCount: t._count?.employees ?? 0,
    createdAt: t.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: t.updatedAt?.toISOString() ?? new Date().toISOString(),
    createdBy: t.createdBy ?? "",
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            employees: true,
            users: true,
            departments: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapTenant(tenant) });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check slug uniqueness if changed
    if (body.slug) {
      const existing = await prisma.tenant.findFirst({
        where: {
          slug: body.slug,
          NOT: { id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.nameAr && { nameAr: body.nameAr }),
        ...(body.slug && { slug: body.slug }),
        ...(body.domain !== undefined && { domain: body.domain }),
        ...(body.logo !== undefined && { logo: body.logo }),
        ...(body.timezone && { timezone: body.timezone }),
        ...(body.currency && { currency: body.currency }),
        ...(body.weekStartDay !== undefined && { weekStartDay: body.weekStartDay }),
        ...(body.plan && { plan: body.plan.toUpperCase() }),
        ...(body.planExpiresAt && { planExpiresAt: new Date(body.planExpiresAt) }),
        ...(body.maxEmployees !== undefined && { maxEmployees: body.maxEmployees }),
        ...(body.status && { status: body.status.toUpperCase() }),
        ...(body.settings && { settings: body.settings }),
      },
      include: {
        _count: {
          select: {
            employees: true,
            users: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: mapTenant(tenant) });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Soft delete by setting status to CANCELLED
    await prisma.tenant.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}
