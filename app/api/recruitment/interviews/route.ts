/**
 * Interviews API Routes
 * /api/recruitment/interviews
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function mapStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, "-");
}

function mapType(type: string): string {
  return type.toLowerCase().replace(/_/g, "-");
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
    const applicantId = searchParams.get("applicantId");
    const jobPostingId = searchParams.get("jobPostingId");
    const status = searchParams.get("status");

    const where: any = { tenantId };

    if (applicantId) {
      where.applicantId = applicantId;
    }

    if (jobPostingId) {
      where.jobPostingId = jobPostingId;
    }

    if (status) {
      where.status = status.toUpperCase().replace(/-/g, "_");
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
            titleAr: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    const result = interviews.map((i) => ({
      id: i.id,
      applicantId: i.applicantId,
      applicantName: `${i.applicant.firstName} ${i.applicant.lastName}`,
      applicantEmail: i.applicant.email,
      jobPostingId: i.jobPostingId,
      jobTitle: i.jobPosting.title,
      type: mapType(i.type),
      status: mapStatus(i.status),
      scheduledAt: i.scheduledAt.toISOString(),
      duration: i.duration,
      location: i.location,
      meetingLink: i.meetingLink,
      interviewerId: i.interviewerId,
      interviewerName: i.interviewer
        ? `${i.interviewer.firstNameAr || i.interviewer.firstName} ${i.interviewer.lastNameAr || i.interviewer.lastName}`
        : null,
      feedback: i.feedback,
      rating: i.rating,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interviews" },
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

    const interview = await prisma.interview.create({
      data: {
        tenantId,
        applicantId: body.applicantId,
        jobPostingId: body.jobPostingId,
        type: body.type ? body.type.toUpperCase().replace(/-/g, "_") : "HR",
        status: body.status ? body.status.toUpperCase().replace(/-/g, "_") : "SCHEDULED",
        scheduledAt: new Date(body.scheduledAt),
        duration: body.duration || 60,
        location: body.location,
        meetingLink: body.meetingLink,
        interviewerId: body.interviewerId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: interview.id,
        type: mapType(interview.type),
        status: mapStatus(interview.status),
        scheduledAt: interview.scheduledAt.toISOString(),
        createdAt: interview.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
