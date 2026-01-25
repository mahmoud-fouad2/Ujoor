import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/db";
import { getMobileDeviceHeaders } from "@/lib/mobile/device";
import { rotateRefreshToken } from "@/lib/mobile/refresh-tokens";
import { issueMobileAccessToken } from "@/lib/mobile/jwt";

const schema = z.object({
  refreshToken: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    let deviceHeaders;
    try {
      deviceHeaders = getMobileDeviceHeaders(request);
    } catch {
      return NextResponse.json({ error: "Missing or invalid device" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const xff = request.headers.get("x-forwarded-for") ?? undefined;
    const ipAddress = xff ? xff.split(",")[0]?.trim() : undefined;

    const rotated = await rotateRefreshToken(prisma, {
      rawRefreshToken: parsed.data.refreshToken,
      deviceId: deviceHeaders.deviceId,
      userAgent: deviceHeaders.userAgent,
      ipAddress,
    });

    if (!rotated.ok) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    await prisma.mobileDevice.update({
      where: { id: rotated.mobileDeviceId },
      data: { lastSeenAt: new Date() },
    });

    const user = await prisma.user.findUnique({
      where: { id: rotated.userId },
      select: {
        id: true,
        role: true,
        tenantId: true,
        status: true,
        tenant: { select: { status: true } },
        employee: { select: { id: true } },
      },
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.status === "INACTIVE" || user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    if (user.status === "PENDING_VERIFICATION") {
      return NextResponse.json({ error: "Email verification required" }, { status: 403 });
    }

    if (user.tenant && user.tenant.status !== "ACTIVE" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Tenant is not active" }, { status: 403 });
    }

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: "MOBILE_REFRESH",
        entity: "User",
        entityId: user.id,
      },
    });

    const accessToken = await issueMobileAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      employeeId: user.employee?.id ?? null,
      deviceId: deviceHeaders.deviceId,
    });

    return NextResponse.json({
      data: {
        accessToken,
        refreshToken: rotated.refreshToken,
      },
    });
  } catch (error) {
    console.error("Mobile refresh error:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
