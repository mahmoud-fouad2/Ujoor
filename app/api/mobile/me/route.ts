import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireMobileAuthWithDevice } from "@/lib/mobile/auth";

export async function GET(request: NextRequest) {
  const payloadOrRes = await requireMobileAuthWithDevice(request);
  if (payloadOrRes instanceof NextResponse) return payloadOrRes;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payloadOrRes.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        permissions: true,
        tenantId: true,
        tenant: { select: { id: true, slug: true, name: true, nameAr: true, status: true, plan: true } },
        employee: { select: { id: true, employeeNumber: true, firstName: true, lastName: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Mobile me error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
