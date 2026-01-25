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

const upsertSchema = z.object({
  tenantId: z.string().optional(),
  enforceGeofence: z.boolean().optional(),
  allowCheckInWithoutLocation: z.boolean().optional(),
  maxAccuracyMeters: z.coerce.number().int().min(5).max(1000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedTenantId = searchParams.get("tenantId") ?? undefined;

    const tenantId = isSuperAdmin(session.user.role)
      ? requestedTenantId ?? session.user.tenantId
      : session.user.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
    }

    const policy = await prisma.tenantAttendancePolicy.findUnique({
      where: { tenantId },
    });

    return NextResponse.json({
      data: policy ?? {
        tenantId,
        enforceGeofence: false,
        allowCheckInWithoutLocation: true,
        maxAccuracyMeters: 50,
      },
      exists: Boolean(policy),
    });
  } catch (error) {
    console.error("Error fetching attendance policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance policy" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAttendanceSettings(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = upsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const tenantId = isSuperAdmin(session.user.role)
      ? parsed.data.tenantId ?? session.user.tenantId
      : session.user.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
    }

    const data = {
      enforceGeofence: parsed.data.enforceGeofence,
      allowCheckInWithoutLocation: parsed.data.allowCheckInWithoutLocation,
      maxAccuracyMeters: parsed.data.maxAccuracyMeters,
    };

    const policy = await prisma.tenantAttendancePolicy.upsert({
      where: { tenantId },
      create: {
        tenantId,
        enforceGeofence: data.enforceGeofence ?? false,
        allowCheckInWithoutLocation: data.allowCheckInWithoutLocation ?? true,
        maxAccuracyMeters: data.maxAccuracyMeters ?? 50,
      },
      update: Object.fromEntries(
        Object.entries(data).filter(([, v]) => typeof v !== "undefined")
      ),
    });

    return NextResponse.json({ data: policy }, { status: 200 });
  } catch (error) {
    console.error("Error updating attendance policy:", error);
    return NextResponse.json(
      { error: "Failed to update attendance policy" },
      { status: 500 }
    );
  }
}
