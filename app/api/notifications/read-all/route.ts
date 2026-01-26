/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const tenantId = session.user.tenantId ?? null;

    await prisma.notification.updateMany({
      where: { userId, ...(tenantId ? { tenantId } : {}), isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
