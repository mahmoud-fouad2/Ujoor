import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/db";
import { getMobileDeviceHeaders } from "@/lib/mobile/device";
import { hashRefreshToken, revokeRefreshToken } from "@/lib/mobile/refresh-tokens";

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

    const ok = await revokeRefreshToken(prisma, {
      rawRefreshToken: parsed.data.refreshToken,
      deviceId: deviceHeaders.deviceId,
    });

    // best-effort audit log: only if token was valid (otherwise we don't know user)
    if (ok) {
      const tokenHash = hashRefreshToken(parsed.data.refreshToken);
      const row = await prisma.mobileRefreshToken.findUnique({
        where: { tokenHash },
        select: { userId: true, user: { select: { tenantId: true } } },
      });
      if (row) {
        await prisma.auditLog.create({
          data: {
            tenantId: row.user.tenantId,
            userId: row.userId,
            action: "MOBILE_LOGOUT",
            entity: "User",
            entityId: row.userId,
          },
        });
      }
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Mobile logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
