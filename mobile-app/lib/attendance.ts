import { apiFetch } from "./api";

export type ChallengeResponse = { nonce: string; expiresAt: string };

export async function createMobileChallenge(accessToken: string) {
  return apiFetch<ChallengeResponse>("/api/mobile/auth/challenge", {
    method: "POST",
    accessToken,
  });
}

export async function submitAttendance(
  accessToken: string,
  input: { type: "check-in" | "check-out"; latitude?: number; longitude?: number; accuracy?: number; address?: string }
) {
  const challenge = await createMobileChallenge(accessToken);
  if (!challenge.ok) return challenge;

  return apiFetch<any>("/api/mobile/attendance", {
    method: "POST",
    accessToken,
    body: input,
    extraHeaders: {
      "x-mobile-challenge": challenge.data.nonce,
    },
  });
}
