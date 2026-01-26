import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/db";
import { logger } from "@/lib/logger";
import { getMobileDeviceHeaders } from "@/lib/mobile/device";
import { hashRefreshToken, revokeRefreshToken } from "@/lib/mobile/refresh-tokens";
import { checkRateLimit, withRateLimitHeaders } from "@/lib/rate-limit";

const schema = z.object({
  refreshToken: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const limit = 30;
    const limitInfo = checkRateLimit(request, {
      keyPrefix: "mobile:auth:logout",
      limit,
      windowMs: 5 * 60 * 1000,
    });

    if (!limitInfo.allowed) {
      return withRateLimitHeaders(
        NextResponse.json({ error: "Too many requests" }, { status: 429 }),
        { limit, remaining: limitInfo.remaining, resetAt: limitInfo.resetAt }
      );
    }

    let deviceHeaders;
    try {
      deviceHeaders = getMobileDeviceHeaders(request);
    } catch {
      return withRateLimitHeaders(
        NextResponse.json({ error: "Missing or invalid device" }, { status: 400 }),
        { limit, remaining: limitInfo.remaining, resetAt: limitInfo.resetAt }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return withRateLimitHeaders(
        NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 }),
        { limit, remaining: limitInfo.remaining, resetAt: limitInfo.resetAt }
      );
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

    return withRateLimitHeaders(NextResponse.json({ data: { ok: true } }), {
      limit,
      remaining: limitInfo.remaining,
      resetAt: limitInfo.resetAt,
    });
  } catch (error) {
    logger.error("Mobile logout error", undefined, error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
