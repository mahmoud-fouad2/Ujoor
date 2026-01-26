import { getApiBaseUrl } from "./config";
import { getMobileDeviceHeaders } from "./device";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: "GET" | "POST";
    body?: unknown;
    accessToken?: string | null;
    extraHeaders?: Record<string, string>;
  }
): Promise<ApiResult<T>> {
  try {
    const baseUrl = getApiBaseUrl();
    const headers = await getMobileDeviceHeaders();

    const res = await fetch(`${baseUrl}${path}`, {
      method: opts?.method ?? "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        ...(opts?.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : {}),
        ...(opts?.extraHeaders ?? {}),
      },
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
    });

    const status = res.status;
    const json = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      return { ok: false, error: json?.error || "Request failed", status };
    }

    return { ok: true, data: (json?.data ?? json) as T };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Network request failed",
    };
  }
}
