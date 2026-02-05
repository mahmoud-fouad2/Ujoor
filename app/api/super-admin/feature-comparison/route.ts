/**
 * Plan Feature Comparison API (Super Admin Only)
 * GET  - Get all feature comparisons
 * POST - Create new feature
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all feature comparisons
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const features = await prisma.planFeatureComparison.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ data: features });
  } catch (error) {
    console.error("GET feature comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new feature
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const feature = await prisma.planFeatureComparison.create({
      data: {
        featureAr: body.featureAr,
        featureEn: body.featureEn,
        inStarter: body.inStarter || false,
        inBusiness: body.inBusiness || false,
        inEnterprise: body.inEnterprise || false,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ data: feature }, { status: 201 });
  } catch (error) {
    console.error("POST feature comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
