import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";

import type { AppLanguage } from "@/lib/settings-storage";
import { getStoredLanguage, setStoredLanguage } from "@/lib/settings-storage";

type AppSettings = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
};

const SettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("ar");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getStoredLanguage();
      if (!mounted) return;
      if (stored) setLanguageState(stored);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = async (lang: AppLanguage) => {
    await setStoredLanguage(lang);

    const rtl = lang === "ar";
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(rtl);

    setLanguageState(lang);

    // Apply direction changes consistently.
    try {
      await Updates.reloadAsync();
    } catch {
      // If reload fails (rare), user can manually restart.
    }
  };

  const value = useMemo<AppSettings>(() => ({ language, setLanguage }), [language]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}
