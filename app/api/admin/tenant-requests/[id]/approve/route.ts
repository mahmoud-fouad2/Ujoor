import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
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

function isValidSlug(value: string): boolean {
  return /^[a-z0-9-]{3,30}$/.test(value);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

function mapTenant(t: any): Tenant {
  return {
    id: t.id,
    name: t.name,
    nameAr: t.nameAr ?? t.name,
    slug: t.slug,
    status: (t.status?.toLowerCase() ?? "pending") as TenantStatus,
    plan: mapPlanFromDb(t.plan),
    email: "",
    country: "SA",
    defaultLocale: "ar",
    defaultTheme: "shadcn",
    timezone: t.timezone ?? "Asia/Riyadh",
    usersCount: t._count?.users ?? 0,
    employeesCount: t._count?.employees ?? 0,
    createdAt: t.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: t.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    createdBy: "",
  };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.tenantRequest.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (item.status !== "PENDING") {
    return NextResponse.json({ error: "Request already processed" }, { status: 400 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const preferredSlug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  let baseSlug = preferredSlug || slugify(item.companyNameAr ?? item.companyName);
  if (!isValidSlug(baseSlug)) {
    baseSlug = slugify(item.companyName);
  }
  if (!isValidSlug(baseSlug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  let slug = baseSlug;
  for (let i = 2; i <= 25; i++) {
    const exists = await prisma.tenant.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${baseSlug}-${i}`.slice(0, 30);
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: body.name ?? item.companyName,
      nameAr: body.nameAr ?? item.companyNameAr ?? item.companyName,
      slug,
      plan: item.plan,
      status: "ACTIVE",
      settings: {
        defaultLocale: body.defaultLocale ?? "ar",
        defaultTheme: body.defaultTheme ?? "shadcn",
      },
      planExpiresAt: item.plan === "TRIAL" ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
    },
    include: {
      _count: { select: { users: true, employees: true } },
    },
  });

  await prisma.tenantRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      processedAt: new Date(),
      processedById: session.user.id ?? null,
      tenantId: tenant.id,
      rejectionReason: null,
    },
  });

  return NextResponse.json({
    data: mapTenant(tenant),
  });
}
