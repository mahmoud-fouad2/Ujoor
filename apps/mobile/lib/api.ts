import { getApiBaseUrl } from "@/lib/config";

export async function apiFetch<T = any>(pathname: string, opts?: { token?: string; init?: RequestInit }): Promise<T> {
  const base = getApiBaseUrl();
  const url = pathname.startsWith("http") ? pathname : `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts?.init?.headers as any),
  };

  if (!headers["Content-Type"] && opts?.init?.body) {
    headers["Content-Type"] = "application/json";
  }

  if (opts?.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }

  const res = await fetch(url, {
    ...opts?.init,
    headers,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = json?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json as T;
}
