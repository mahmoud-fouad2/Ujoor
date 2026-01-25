import { SignJWT, jwtVerify } from "jose";

export type MobileTokenPayload = {
  userId: string;
  tenantId: string | null;
  role: string;
  employeeId: string | null;
};

function getSecret(): Uint8Array {
  const secret = process.env.MOBILE_JWT_SECRET;
  if (!secret) {
    throw new Error("MOBILE_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function issueMobileAccessToken(payload: MobileTokenPayload, opts?: { ttlSeconds?: number }) {
  const ttlSeconds = opts?.ttlSeconds ?? 60 * 60 * 8; // 8 hours
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    userId: payload.userId,
    tenantId: payload.tenantId,
    role: payload.role,
    employeeId: payload.employeeId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret());
}

export async function verifyMobileAccessToken(token: string): Promise<MobileTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  });

  const userId = typeof payload.userId === "string" ? payload.userId : null;
  const tenantId = typeof payload.tenantId === "string" ? payload.tenantId : null;
  const role = typeof payload.role === "string" ? payload.role : null;
  const employeeId = typeof payload.employeeId === "string" ? payload.employeeId : null;

  if (!userId || !role) {
    throw new Error("Invalid token payload");
  }

  return { userId, tenantId, role, employeeId };
}
