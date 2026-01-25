import { NextRequest, NextResponse } from "next/server";
import { verifyMobileAccessToken, type MobileTokenPayload } from "@/lib/mobile/jwt";

export async function getMobileAuthPayload(request: NextRequest): Promise<MobileTokenPayload | null> {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  try {
    return await verifyMobileAccessToken(match[1]);
  } catch {
    return null;
  }
}

export async function requireMobileAuth(request: NextRequest): Promise<MobileTokenPayload | NextResponse> {
  const payload = await getMobileAuthPayload(request);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return payload;
}
