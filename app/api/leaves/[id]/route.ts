/**
 * Single Leave Request API Routes
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            department: true,
            jobTitle: true,
          },
        },
        leaveType: true,
      },
    });

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    return NextResponse.json({ data: leaveRequest });
  } catch (error) {
    console.error("Error fetching leave request:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle approval/rejection
    if (body.action === "approve" || body.action === "reject") {
      const leaveRequest = await prisma.leaveRequest.update({
        where: { id },
        data: {
          status: body.action === "approve" ? "APPROVED" : "REJECTED",
          approvedById: session.user.id,
          approvedAt: new Date(),
          rejectionReason: body.rejectionReason,
        },
      });

      // If approved, update leave balance
      if (body.action === "approve") {
        const lr = await prisma.leaveRequest.findUnique({
          where: { id },
          include: { leaveType: true },
        });

        if (lr) {
          await prisma.leaveBalance.updateMany({
            where: {
              employeeId: lr.employeeId,
              leaveTypeId: lr.leaveTypeId,
              year: new Date().getFullYear(),
            },
            data: {
              used: { increment: Number(lr.totalDays) },
              pending: { decrement: Number(lr.totalDays) },
            },
          });
        }
      }

      return NextResponse.json({ data: leaveRequest });
    }

    // Regular update
    const leaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        reason: body.reason,
        attachmentUrl: body.attachmentUrl,
      },
    });

    return NextResponse.json({ data: leaveRequest });
  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Failed to update leave request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only cancel pending requests" },
        { status: 400 }
      );
    }

    await prisma.leaveRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    return NextResponse.json(
      { error: "Failed to cancel leave request" },
      { status: 500 }
    );
  }
}
