/**
 * Notifications Unread Count API
 * GET /api/notifications/unread-count
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const tenantId = session.user.tenantId ?? null;

    const count = await prisma.notification.count({
      where: {
        userId,
        ...(tenantId ? { tenantId } : {}),
        isRead: false,
      },
    });

    return NextResponse.json({ data: { count } });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}
