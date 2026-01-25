import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { compare } from "bcryptjs";
import { issueMobileAccessToken } from "@/lib/mobile/jwt";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        permissions: true,
        tenantId: true,
        status: true,
        lockedUntil: true,
        failedLoginAttempts: true,
        password: true,
        tenant: {
          select: { id: true, slug: true, name: true, nameAr: true, status: true, plan: true },
        },
        employee: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ error: "Account is temporarily locked" }, { status: 403 });
    }

    if (user.status === "INACTIVE" || user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    if (user.status === "PENDING_VERIFICATION") {
      return NextResponse.json({ error: "Email verification required" }, { status: 403 });
    }

    const ok = await compare(parsed.data.password, user.password);

    if (!ok) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          lockedUntil: user.failedLoginAttempts >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : undefined,
        },
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.tenant && user.tenant.status !== "ACTIVE" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Tenant is not active" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: "MOBILE_LOGIN",
        entity: "User",
        entityId: user.id,
      },
    });

    const accessToken = await issueMobileAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      employeeId: user.employee?.id ?? null,
    });

    return NextResponse.json({
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
          permissions: user.permissions,
          tenantId: user.tenantId,
          tenant: user.tenant,
          employeeId: user.employee?.id ?? null,
        },
      },
    });
  } catch (error) {
    console.error("Mobile login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
