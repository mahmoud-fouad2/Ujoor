/**
 * Job Offer (single) API Routes
 * /api/recruitment/job-offers/:id
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function mapStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, "-");
}

function mapJobType(type: string | null | undefined): string | null {
  if (!type) return null;
  return type.toLowerCase().replace(/_/g, "-");
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "No tenant" }, { status: 400 });
    }

    const { id } = await context.params;

    const offer = await prisma.jobOffer.findFirst({
      where: { id, tenantId },
      include: {
        applicant: { select: { id: true, firstName: true, lastName: true, email: true } },
        jobPosting: { select: { id: true, title: true } },
        department: { select: { id: true, name: true } },
      },
    });

    if (!offer) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: offer.id,
        applicantId: offer.applicantId,
        applicantName: `${offer.applicant.firstName} ${offer.applicant.lastName}`,
        applicantEmail: offer.applicant.email,
        jobPostingId: offer.jobPostingId,
        jobTitle: offer.jobPosting.title,
        departmentId: offer.departmentId ?? "",
        departmentName: offer.department?.name ?? "",
        offeredSalary: offer.offeredSalary ? Number(offer.offeredSalary) : 0,
        currency: offer.currency ?? "SAR",
        jobType: mapJobType(offer.jobType) ?? "full-time",
        startDate: offer.startDate?.toISOString() ?? new Date().toISOString(),
        probationPeriod: offer.probationPeriod ?? undefined,
        benefits: (offer.benefits as any) ?? [],
        termsAndConditions: offer.termsAndConditions ?? undefined,
        status: mapStatus(offer.status),
        validUntil: offer.validUntil?.toISOString() ?? new Date().toISOString(),
        approvers: (offer.approvers as any) ?? [],
        sentAt: offer.sentAt?.toISOString() ?? undefined,
        respondedAt: offer.respondedAt?.toISOString() ?? undefined,
        declineReason: offer.declineReason ?? undefined,
        createdBy: offer.createdById,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching job offer:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch job offer" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "No tenant" }, { status: 400 });
    }

    const { id } = await context.params;

    await prisma.jobOffer.deleteMany({ where: { id, tenantId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job offer:", error);
    return NextResponse.json({ success: false, error: "Failed to delete job offer" }, { status: 500 });
  }
}
