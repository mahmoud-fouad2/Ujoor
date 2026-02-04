"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { LocaleTransitionOverlay } from "./locale-transition";
import { RouteProgress } from "./route-progress";
import { ConsoleNoiseGuard } from "./console-noise-guard";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <ConsoleNoiseGuard />
      <RouteProgress />
      <LocaleTransitionOverlay />
      <Toaster />
    </ThemeProvider>
  );
}
