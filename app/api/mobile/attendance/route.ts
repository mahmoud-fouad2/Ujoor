import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireMobileAuth } from "@/lib/mobile/auth";
import { submitAttendance } from "@/lib/attendance/submit-attendance";

export async function GET(request: NextRequest) {
  const payloadOrRes = await requireMobileAuth(request);
  if (payloadOrRes instanceof NextResponse) return payloadOrRes;

  if (!payloadOrRes.tenantId) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  if (!payloadOrRes.employeeId) {
    return NextResponse.json({ error: "Employee context required" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Math.min(Number(searchParams.get("limit") ?? "30"), 100);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      tenantId: payloadOrRes.tenantId,
      employeeId: payloadOrRes.employeeId,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [items, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.attendanceRecord.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        items,
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("Mobile attendance GET error:", error);
    return NextResponse.json({ error: "Failed to load attendance" }, { status: 500 });
  }
}

const schema = z.object({
  type: z.enum(["check-in", "check-out"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracy: z.number().optional(),
  address: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const payloadOrRes = await requireMobileAuth(request);
  if (payloadOrRes instanceof NextResponse) return payloadOrRes;

  if (!payloadOrRes.tenantId) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  if (!payloadOrRes.employeeId) {
    return NextResponse.json({ error: "Employee context required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const record = await submitAttendance({
      tenantId: payloadOrRes.tenantId,
      employeeId: payloadOrRes.employeeId,
      type: parsed.data.type,
      source: "MOBILE",
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      accuracy: parsed.data.accuracy,
      address: parsed.data.address,
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error: any) {
    const status = typeof error?.status === "number" ? error.status : 500;
    const message = typeof error?.message === "string" ? error.message : "Failed to record attendance";
    if (status >= 500) console.error("Mobile attendance error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
