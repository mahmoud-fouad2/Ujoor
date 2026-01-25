import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { requireMobileAuthWithDevice } from "@/lib/mobile/auth";
import { revokeAllRefreshTokensForUser } from "@/lib/mobile/refresh-tokens";

export async function POST(request: NextRequest) {
  try {
    const payloadOrRes = await requireMobileAuthWithDevice(request);
    if (payloadOrRes instanceof NextResponse) return payloadOrRes;

    const count = await revokeAllRefreshTokensForUser(prisma, payloadOrRes.userId);

    await prisma.auditLog.create({
      data: {
        tenantId: payloadOrRes.tenantId,
        userId: payloadOrRes.userId,
        action: "MOBILE_LOGOUT_ALL",
        entity: "User",
        entityId: payloadOrRes.userId,
      },
    });

    return NextResponse.json({ data: { ok: true, revoked: count } });
  } catch (error) {
    console.error("Mobile logout-all error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
