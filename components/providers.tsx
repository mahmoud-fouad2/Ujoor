"use client";

import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "./ui/sonner";

function getCookieValue(cookieName: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

type UiTheme = "shadcn" | "mantine";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [uiTheme, setUiTheme] = useState<UiTheme>("shadcn");

  useEffect(() => {
    const value = getCookieValue("ujoors_ui_theme");
    if (value === "mantine" || value === "shadcn") setUiTheme(value);
  }, []);

  const mantineValue = useMemo(() => ({ uiTheme, setUiTheme }), [uiTheme]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MantineProvider
        // Mantine is optional; wrapping is safe for shadcn screens.
        // We will progressively route shared components through a theme adapter.
        theme={{}}
      >
        {children}
        <Toaster />
      </MantineProvider>
    </ThemeProvider>
  );
}
