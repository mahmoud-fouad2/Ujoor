import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isSuperAdmin(role: string | undefined) {
  return role === "SUPER_ADMIN";
}

function canManageAttendanceSettings(role: string | undefined) {
  return role === "TENANT_ADMIN" || role === "HR_MANAGER" || role === "SUPER_ADMIN";
}

const updateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  nameAr: z.string().min(2).max(120).optional(),
  address: z.string().max(500).optional().nullable(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusMeters: z.coerce.number().int().min(10).max(5000).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAttendanceSettings(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    const existing = await prisma.tenantWorkLocation.findUnique({
      where: { id },
      select: { id: true, tenantId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isSuperAdmin(session.user.role)) {
      if (!session.user.tenantId || existing.tenantId !== session.user.tenantId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.tenantWorkLocation.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating work location:", error);
    return NextResponse.json(
      { error: "Failed to update work location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAttendanceSettings(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    const existing = await prisma.tenantWorkLocation.findUnique({
      where: { id },
      select: { id: true, tenantId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isSuperAdmin(session.user.role)) {
      if (!session.user.tenantId || existing.tenantId !== session.user.tenantId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await prisma.tenantWorkLocation.delete({ where: { id } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting work location:", error);
    return NextResponse.json(
      { error: "Failed to delete work location" },
      { status: 500 }
    );
  }
}
