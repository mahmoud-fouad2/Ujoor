export function getApiBaseUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (env && /^https?:\/\//.test(env)) return env.replace(/\/$/, "");
  return "http://localhost:3000";
}
