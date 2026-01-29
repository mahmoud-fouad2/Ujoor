/**
 * Job Postings API Routes
 * /api/recruitment/job-postings
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Map DB status to kebab-case
function mapStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, "-");
}

// Map DB enum values to kebab-case
function mapJobType(type: string): string {
  return type.toLowerCase().replace(/_/g, "-");
}

function mapExperienceLevel(level: string): string {
  return level.toLowerCase();
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

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "No tenant" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const departmentId = searchParams.get("departmentId");

    const where: any = { tenantId };

    if (status) {
      where.status = status.toUpperCase().replace(/-/g, "_");
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const jobPostings = await prisma.jobPosting.findMany({
      where,
      include: {
        department: true,
        jobTitle: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            applicants: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = jobPostings.map((jp) => ({
      id: jp.id,
      title: jp.title,
      titleAr: jp.titleAr,
      description: jp.description,
      requirements: jp.requirements,
      responsibilities: jp.responsibilities,
      benefits: jp.benefits,
      departmentId: jp.departmentId,
      departmentName: jp.department?.name,
      jobTitleId: jp.jobTitleId,
      jobTitleName: jp.jobTitle?.name,
      status: mapStatus(jp.status),
      jobType: mapJobType(jp.jobType),
      experienceLevel: mapExperienceLevel(jp.experienceLevel),
      positions: jp.positions,
      location: jp.location,
      salaryMin: jp.salaryMin ? parseFloat(jp.salaryMin.toString()) : null,
      salaryMax: jp.salaryMax ? parseFloat(jp.salaryMax.toString()) : null,
      salaryCurrency: jp.salaryCurrency,
      postedAt: jp.postedAt?.toISOString(),
      closedAt: jp.closedAt?.toISOString(),
      expiresAt: jp.expiresAt?.toISOString(),
      createdBy: {
        id: jp.createdBy.id,
        name: `${jp.createdBy.firstName} ${jp.createdBy.lastName}`,
      },
      applicantsCount: jp._count.applicants,
      createdAt: jp.createdAt.toISOString(),
      updatedAt: jp.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job postings" },
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

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "No tenant" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const jobPosting = await prisma.jobPosting.create({
      data: {
        tenantId,
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        benefits: body.benefits,
        departmentId: body.departmentId,
        jobTitleId: body.jobTitleId,
        status: body.status ? body.status.toUpperCase().replace(/-/g, "_") : "DRAFT",
        jobType: body.jobType ? body.jobType.toUpperCase().replace(/-/g, "_") : "FULL_TIME",
        experienceLevel: body.experienceLevel ? body.experienceLevel.toUpperCase() : "MID",
        positions: body.positions || 1,
        location: body.location,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        salaryCurrency: body.salaryCurrency || "SAR",
        postedAt: body.postedAt ? new Date(body.postedAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        createdById: session.user.id,
      },
      include: {
        department: true,
        jobTitle: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: jobPosting.id,
        title: jobPosting.title,
        status: mapStatus(jobPosting.status),
        createdAt: jobPosting.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}
