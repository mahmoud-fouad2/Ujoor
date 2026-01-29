/**
 * Applicants API Routes
 * /api/recruitment/applicants
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function mapStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, "-");
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
    const jobPostingId = searchParams.get("jobPostingId");
    const status = searchParams.get("status");

    const where: any = { tenantId };

    if (jobPostingId) {
      where.jobPostingId = jobPostingId;
    }

    if (status) {
      where.status = status.toUpperCase().replace(/-/g, "_");
    }

    const applicants = await prisma.applicant.findMany({
      where,
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            titleAr: true,
          },
        },
        _count: {
          select: {
            interviews: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    const result = applicants.map((a) => ({
      id: a.id,
      jobPostingId: a.jobPostingId,
      jobTitle: a.jobPosting.title,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      phone: a.phone,
      resumeUrl: a.resumeUrl,
      coverLetter: a.coverLetter,
      status: mapStatus(a.status),
      source: a.source,
      rating: a.rating,
      notes: a.notes,
      appliedAt: a.appliedAt.toISOString(),
      interviewsCount: a._count.interviews,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applicants" },
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

    const applicant = await prisma.applicant.create({
      data: {
        tenantId,
        jobPostingId: body.jobPostingId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        resumeUrl: body.resumeUrl,
        coverLetter: body.coverLetter,
        status: body.status ? body.status.toUpperCase().replace(/-/g, "_") : "NEW",
        source: body.source || "career-portal",
        rating: body.rating,
        notes: body.notes,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: applicant.id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        status: mapStatus(applicant.status),
        createdAt: applicant.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating applicant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create applicant" },
      { status: 500 }
    );
  }
}
