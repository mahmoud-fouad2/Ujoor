import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { checkRateLimit, withRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
	return handler(req);
}

export async function POST(req: Request) {
	const path = new URL(req.url).pathname;
	const isCredentials = path.includes("/callback/credentials") || path.includes("/signin/credentials");

	if (!isCredentials) {
		return handler(req);
	}

	const limit = 10;
	const limitInfo = checkRateLimit(req, {
		keyPrefix: "web:auth:credentials",
		limit,
		windowMs: 5 * 60 * 1000,
	});

	if (!limitInfo.allowed) {
		return withRateLimitHeaders(
			NextResponse.json({ error: "Too many requests" }, { status: 429 }),
			{ limit, remaining: limitInfo.remaining, resetAt: limitInfo.resetAt }
		);
	}

	const res = await handler(req);
	return withRateLimitHeaders(res, { limit, remaining: limitInfo.remaining, resetAt: limitInfo.resetAt });
}
