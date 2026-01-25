import { NextRequest } from "next/server";

export type MobileDeviceHeaders = {
  deviceId: string;
  platform?: string;
  name?: string;
  appVersion?: string;
  userAgent?: string;
};

export function getMobileDeviceHeaders(request: NextRequest): MobileDeviceHeaders {
  const deviceId = request.headers.get("x-device-id") ?? "";
  if (!deviceId || deviceId.length < 8 || deviceId.length > 200) {
    throw new Error("Missing or invalid x-device-id");
  }

  const platform = request.headers.get("x-device-platform") ?? undefined;
  const name = request.headers.get("x-device-name") ?? undefined;
  const appVersion = request.headers.get("x-app-version") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  return { deviceId, platform, name, appVersion, userAgent };
}
