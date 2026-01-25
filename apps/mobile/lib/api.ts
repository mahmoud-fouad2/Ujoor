import { getApiBaseUrl } from "@/lib/config";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { getOrCreateDeviceId } from "@/lib/auth-storage";

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(message: string, status: number, body: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T = any>(pathname: string, opts?: { token?: string; init?: RequestInit }): Promise<T> {
  const base = getApiBaseUrl();
  const url = pathname.startsWith("http") ? pathname : `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts?.init?.headers as any),
  };

  const deviceId = await getOrCreateDeviceId();
  headers["x-device-id"] = deviceId;
  headers["x-device-platform"] = Platform.OS;
  const appVersion =
    (Constants.expoConfig as any)?.version ??
    (Constants as any).nativeAppVersion ??
    (Constants as any).manifest?.version ??
    undefined;
  if (typeof appVersion === "string" && appVersion) {
    headers["x-app-version"] = appVersion;
  }

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
    throw new ApiError(message, res.status, json);
  }

  return json as T;
}
