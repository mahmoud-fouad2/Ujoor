/**
 * Delete all read notifications
 * DELETE /api/notifications/read
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const tenantId = session.user.tenantId ?? null;

    await prisma.notification.deleteMany({
      where: { userId, ...(tenantId ? { tenantId } : {}), isRead: true },
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete read notifications" },
      { status: 500 }
    );
  }
}
