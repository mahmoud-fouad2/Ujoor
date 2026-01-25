"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Locale = "ar" | "en";
type UiTheme = "shadcn" | "mantine";

function setCookie(name: string, value: string) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${encodeURIComponent(name)}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function TenantControls() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [uiTheme, setUiTheme] = useState<UiTheme>("shadcn");

  useEffect(() => {
    const l = getCookie("ujoors_locale");
    if (l === "en" || l === "ar") setLocale(l);

    const t = getCookie("ujoors_ui_theme");
    if (t === "mantine" || t === "shadcn") setUiTheme(t);
  }, []);

  const toggleLocale = () => {
    const next: Locale = locale === "ar" ? "en" : "ar";
    setCookie("ujoors_locale", next);
    window.location.reload();
  };

  const toggleUiTheme = () => {
    const next: UiTheme = uiTheme === "shadcn" ? "mantine" : "shadcn";
    setCookie("ujoors_ui_theme", next);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={toggleLocale}>
        {locale === "ar" ? "English" : "العربية"}
      </Button>
      <Button variant="outline" onClick={toggleUiTheme}>
        {uiTheme === "shadcn" ? "Mantine UI" : "shadcn/ui"}
      </Button>
    </div>
  );
}
