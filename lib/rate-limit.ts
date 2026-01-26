import type { NextRequest } from "next/server";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  keyPrefix: string;
};

type Bucket = {
  resetAt: number;
  count: number;
};

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

export function getClientIp(req: NextRequest): string {
  // Prefer x-forwarded-for (Render / proxies)
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

export function checkRateLimit(req: NextRequest, options: RateLimitOptions): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const ip = getClientIp(req);
  const key = `${options.keyPrefix}:${ip}`;

  const t = now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= t) {
    const resetAt = t + options.windowMs;
    buckets.set(key, { resetAt, count: 1 });
    return { allowed: true, remaining: Math.max(0, options.limit - 1), resetAt };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, remaining: Math.max(0, options.limit - existing.count), resetAt: existing.resetAt };
}

export function withRateLimitHeaders<T extends Response>(
  res: T,
  info: { remaining: number; resetAt: number; limit: number }
): T {
  res.headers.set("X-RateLimit-Limit", String(info.limit));
  res.headers.set("X-RateLimit-Remaining", String(info.remaining));
  res.headers.set("X-RateLimit-Reset", String(Math.floor(info.resetAt / 1000)));
  return res;
}
