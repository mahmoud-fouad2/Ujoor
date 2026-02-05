/**
 * Pricing Plans API (Super Admin Only)
 * GET  - Get all pricing plans
 * POST - Create new plan
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all pricing plans
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.pricingPlan.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ data: plans });
  } catch (error) {
    console.error("GET pricing plans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check slug uniqueness
    const existing = await prisma.pricingPlan.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug: body.slug,
        priceMonthly: body.priceMonthly,
        priceYearly: body.priceYearly,
        currency: body.currency || "SAR",
        maxEmployees: body.maxEmployees,
        employeesLabel: body.employeesLabel,
        employeesLabelEn: body.employeesLabelEn,
        featuresAr: body.featuresAr || [],
        featuresEn: body.featuresEn || [],
        planType: body.planType || "TRIAL",
        isPopular: body.isPopular || false,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder || 0,
      },
    });

    return NextResponse.json({ data: plan }, { status: 201 });
  } catch (error) {
    console.error("POST pricing plan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
