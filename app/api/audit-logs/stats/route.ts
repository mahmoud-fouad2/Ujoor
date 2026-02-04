/**
 * Audit Log Statistics API
 * GET /api/audit-logs/stats - Get audit log statistics
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAuditLogStats } from "@/lib/audit/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN and ADMIN can view audit stats
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || undefined;

    // Super admin can view stats for any tenant, others only their tenant
    const finalTenantId =
      session.user.role === "SUPER_ADMIN" ? tenantId : session.user.tenantId || undefined;

    const stats = await getAuditLogStats(finalTenantId);

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Error fetching audit log stats:", error);
    return NextResponse.json({ error: "Failed to fetch audit log stats" }, { status: 500 });
  }
}
