import Constants from "expo-constants";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.startsWith("http")) return fromEnv.replace(/\/$/, "");

  // Fallback for local dev (Android emulator).
  // If you run the web app locally: pnpm dev -> http://localhost:3000
  return "http://10.0.2.2:3000";
}

export function getAppVersion(): string {
  return (
    Constants.expoConfig?.version ||
    Constants.nativeAppVersion ||
    Constants.nativeBuildVersion ||
    "0.0.0"
  );
}
