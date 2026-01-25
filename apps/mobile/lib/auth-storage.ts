import * as SecureStore from "expo-secure-store";

const KEY = "ujoors_mobile_access_token";

export async function getStoredAccessToken(): Promise<string | null> {
  return (await SecureStore.getItemAsync(KEY)) ?? null;
}

export async function setStoredAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token);
}

export async function clearStoredAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
