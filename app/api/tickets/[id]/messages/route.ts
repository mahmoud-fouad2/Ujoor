import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const createMessageSchema = z.object({
  body: z.string().min(1).max(5000),
  isInternal: z.boolean().optional().default(false),
});

function isSuperAdmin(role: string | undefined) {
  return role === "SUPER_ADMIN";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const superAdmin = isSuperAdmin(session.user.role);

    if (!superAdmin) {
      if (!session.user.tenantId || ticket.tenantId !== session.user.tenantId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
      if (parsed.data.isInternal) {
        return NextResponse.json({ error: "Internal notes are not allowed" }, { status: 403 });
      }
    }

    const now = new Date();

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: session.user.id,
        body: parsed.data.body,
        isInternal: superAdmin ? parsed.data.isInternal : false,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
    });

    await prisma.supportTicket.update({
      where: { id },
      data: { lastMessageAt: now },
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error("Error adding ticket message:", error);
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}
