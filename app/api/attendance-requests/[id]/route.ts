import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isSuperAdmin(role: string | undefined) {
  return role === "SUPER_ADMIN";
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId && !isSuperAdmin(session.user.role)) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const { id } = await context.params;

    const requestItem = await prisma.attendanceRequest.findFirst({
      where: { id, ...(tenantId ? { tenantId } : {}) },
      include: { employee: { select: { userId: true } } },
    });

    if (!requestItem) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isSuperAdmin(session.user.role)) {
      if (requestItem.employee.userId !== session.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json({ data: requestItem });
  } catch (error) {
    console.error("Error fetching attendance request:", error);
    return NextResponse.json({ error: "Failed to fetch attendance request" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId && !isSuperAdmin(session.user.role)) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const { id } = await context.params;

    const existing = await prisma.attendanceRequest.findFirst({
      where: { id, ...(tenantId ? { tenantId } : {}) },
      include: { employee: { select: { userId: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json({ error: "Can only cancel pending requests" }, { status: 400 });
    }

    if (!isSuperAdmin(session.user.role)) {
      if (existing.employee.userId !== session.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    await prisma.attendanceRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling attendance request:", error);
    return NextResponse.json({ error: "Failed to cancel attendance request" }, { status: 500 });
  }
}
