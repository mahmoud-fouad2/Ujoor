import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const requestSchema = z.object({
  captchaToken: z.string().min(1),
  companyName: z.string().min(2),
  companyNameAr: z.string().min(2).optional().or(z.literal("")),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().or(z.literal("")),
  employeesCount: z.string().min(1),
  message: z.string().max(2000).optional().or(z.literal("")),
});

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: "RECAPTCHA_SECRET_KEY is not configured" } as const;
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = (await res.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
  };

  // Support both v2 and v3 responses.
  if (!data.success) {
    return { ok: false, error: "reCAPTCHA verification failed" } as const;
  }

  if (typeof data.score === "number" && data.score < 0.4) {
    return { ok: false, error: "reCAPTCHA score too low" } as const;
  }

  return { ok: true } as const;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const captcha = await verifyRecaptcha(input.captchaToken);
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 400 });
    }

    await prisma.tenantRequest.create({
      data: {
        companyName: input.companyName,
        companyNameAr: input.companyNameAr || null,
        employeeCount: input.employeesCount,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone || null,
        message: input.message || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
