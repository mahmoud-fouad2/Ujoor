import { NextRequest, NextResponse } from "next/server";

export const MOBILE_REFRESH_COOKIE = "ujoor_mrt";

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getMobileRefreshCookie(request: NextRequest): string | null {
  return request.cookies.get(MOBILE_REFRESH_COOKIE)?.value ?? null;
}

export function setMobileRefreshCookie(
  res: NextResponse,
  refreshToken: string,
  opts?: { expiresAt?: Date }
) {
  res.cookies.set(MOBILE_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/api/mobile/auth",
    ...(opts?.expiresAt ? { expires: opts.expiresAt } : {}),
  });
}

export function clearMobileRefreshCookie(res: NextResponse) {
  res.cookies.set(MOBILE_REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/api/mobile/auth",
    expires: new Date(0),
  });
}
