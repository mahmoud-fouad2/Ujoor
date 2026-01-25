import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { requireMobileAuthWithDevice } from "@/lib/mobile/auth";
import { createChallenge } from "@/lib/mobile/challenge";

export async function POST(request: NextRequest) {
  try {
    const payloadOrRes = await requireMobileAuthWithDevice(request);
    if (payloadOrRes instanceof NextResponse) return payloadOrRes;

    const device = await prisma.mobileDevice.findUnique({
      where: { userId_deviceId: { userId: payloadOrRes.userId, deviceId: payloadOrRes.deviceId } },
      select: { id: true },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not registered" }, { status: 400 });
    }

    const challenge = await createChallenge(prisma, {
      userId: payloadOrRes.userId,
      mobileDeviceId: device.id,
    });

    return NextResponse.json({ data: challenge });
  } catch (error) {
    console.error("Mobile challenge error:", error);
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}
