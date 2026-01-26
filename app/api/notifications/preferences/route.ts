/**
 * Notification Preferences API
 * GET /api/notifications/preferences
 * PUT /api/notifications/preferences
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function defaultByType() {
  return {
    "request-status": { email: true, push: true, sms: false },
    "approval-needed": { email: true, push: true, sms: false },
    reminder: { email: true, push: true, sms: false },
    announcement: { email: true, push: true, sms: false },
    payslip: { email: true, push: true, sms: false },
    "document-expiry": { email: true, push: true, sms: false },
    training: { email: true, push: true, sms: false },
    system: { email: true, push: true, sms: false },
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const pref = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      const created = await prisma.notificationPreference.create({
        data: {
          userId,
          email: true,
          push: true,
          sms: false,
          byType: defaultByType(),
        },
      });

      return NextResponse.json({
        data: {
          email: created.email,
          push: created.push,
          sms: created.sms,
          byType: created.byType ?? defaultByType(),
        },
      });
    }

    return NextResponse.json({
      data: {
        email: pref.email,
        push: pref.push,
        sms: pref.sms,
        byType: pref.byType ?? defaultByType(),
      },
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const updated = await prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        email: body.email ?? true,
        push: body.push ?? true,
        sms: body.sms ?? false,
        byType: body.byType ?? defaultByType(),
      },
      update: {
        ...(body.email !== undefined ? { email: Boolean(body.email) } : {}),
        ...(body.push !== undefined ? { push: Boolean(body.push) } : {}),
        ...(body.sms !== undefined ? { sms: Boolean(body.sms) } : {}),
        ...(body.byType !== undefined ? { byType: body.byType } : {}),
      },
    });

    return NextResponse.json({
      data: {
        email: updated.email,
        push: updated.push,
        sms: updated.sms,
        byType: updated.byType ?? defaultByType(),
      },
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
