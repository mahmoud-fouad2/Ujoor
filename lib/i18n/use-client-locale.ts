"use client";

import { useState, useEffect } from "react";
import type { AppLocale } from "./types";

/**
 * Hook that safely returns the current locale after hydration.
 * Returns a default value during SSR to prevent hydration mismatches.
 */
export function useClientLocale(defaultLocale: AppLocale = "ar"): AppLocale {
  const [locale, setLocale] = useState<AppLocale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get locale from cookie first
    const match = document.cookie.match(/(?:^|; )ujoors_locale=([^;]+)/);
    const cookieLocale = match?.[1] === "en" ? "en" : match?.[1] === "ar" ? "ar" : undefined;
    
    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      // Fallback to <html lang>
      const lang = document.documentElement.lang;
      setLocale(lang === "en" ? "en" : "ar");
    }
  }, []);

  // During SSR and initial render, return default to prevent hydration mismatch
  if (!mounted) return defaultLocale;
  
  return locale;
}

/**
 * Hook that returns true after the component has mounted.
 * Useful for preventing hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
