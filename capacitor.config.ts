import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.ujoor.app",
  appName: "Ujoor",
  // This project is a Next.js app (not statically exportable because of API routes/DB/auth).
  // For APK testing we typically point the Android WebView at a running server.
  webDir: "public",
  bundledWebRuntime: false,
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          // Allow http:// for LAN testing. Use https in production.
          cleartext: true,
        },
      }
    : {}),
};

export default config;
