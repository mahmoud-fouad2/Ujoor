import * as SecureStore from "expo-secure-store";

const KEY_LANG = "app_language";

export type AppLanguage = "ar" | "en";

export async function getStoredLanguage(): Promise<AppLanguage | null> {
  const v = await SecureStore.getItemAsync(KEY_LANG);
  if (v === "ar" || v === "en") return v;
  return null;
}

export async function setStoredLanguage(lang: AppLanguage): Promise<void> {
  await SecureStore.setItemAsync(KEY_LANG, lang);
}
