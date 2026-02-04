"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { LocaleTransitionOverlay } from "./locale-transition";
import { RouteProgress } from "./route-progress";
import { ConsoleNoiseGuard } from "./console-noise-guard";
import { AppDirectionProvider } from "./direction-context";

export default function Providers({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "ltr" | "rtl";
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppDirectionProvider dir={dir}>
        {children}
        <ConsoleNoiseGuard />
        <RouteProgress />
        <LocaleTransitionOverlay />
        <Toaster />
      </AppDirectionProvider>
    </ThemeProvider>
  );
}
