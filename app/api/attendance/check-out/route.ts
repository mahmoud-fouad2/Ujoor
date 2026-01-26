/**
 * Attendance Check-out API
 * POST /api/attendance/check-out
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitAttendance } from "@/lib/attendance/submit-attendance";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const body = await request.json();

    if (!body?.employeeId) {
      return NextResponse.json({ error: "employeeId is required" }, { status: 400 });
    }

    const record = await submitAttendance({
      tenantId,
      employeeId: body.employeeId,
      type: "check-out",
      source: "WEB",
      latitude: body.location?.lat,
      longitude: body.location?.lng,
      address: body.notes,
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    const status = typeof (error as any)?.status === "number" ? (error as any).status : 500;
    const message = typeof (error as any)?.message === "string" ? (error as any).message : "Failed to check out";
    if (status >= 500) console.error("Error during check-out:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
