/**
 * Admin Tenants API Routes - Super Admin Only
 * /api/admin/tenants
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Tenant, TenantStatus } from "@/lib/types/tenant";

// Map DB tenant to client format
function mapTenant(t: any): Tenant {
  return {
    id: t.id,
    name: t.name,
    nameAr: t.nameAr ?? t.name,
    slug: t.slug,
    status: (t.status?.toLowerCase() ?? "pending") as TenantStatus,
    plan: (t.plan?.toLowerCase() ?? "starter") as Tenant["plan"],
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only Super Admin can access this
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const subscriptionPlan = searchParams.get("subscriptionPlan");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameAr: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (subscriptionPlan) {
      where.plan = subscriptionPlan.toUpperCase();
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        include: {
          _count: {
            select: {
              employees: true,
              users: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tenant.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tenants.map(mapTenant),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    // Check if slug is unique
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ slug: body.slug }, body.domain ? { domain: body.domain } : {}].filter(
          (c) => Object.keys(c).length > 0
        ),
      },
    });

    if (existingTenant) {
      return NextResponse.json(
        { success: false, error: "Slug or domain already exists" },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: body.name,
        nameAr: body.nameAr ?? body.name,
        slug: body.slug,
        domain: body.domain,
        logo: body.logo,
        timezone: body.timezone || "Asia/Riyadh",
        currency: body.currency || "SAR",
        weekStartDay: body.weekStartDay || 0,
        plan: (body.plan || "TRIAL").toUpperCase(),
        planExpiresAt: body.planExpiresAt
          ? new Date(body.planExpiresAt)
          : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxEmployees: body.maxEmployees || 10,
        status: "ACTIVE",
        settings: body.settings || {},
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

    return NextResponse.json({ success: true, data: mapTenant(tenant) }, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
