export function formatTimeHHMM(date: Date, locale: "ar" | "en" = "ar") {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}

export function formatArabicDate(date: Date, locale: "ar" | "en" = "ar") {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().split("T")[0];
  }
}

export function greeting(locale: "ar" | "en", now = new Date()) {
  const h = now.getHours();
  if (locale === "en") {
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }
  if (h < 12) return "صباح الخير";
  if (h < 18) return "مساء الخير";
  return "مساء الخير";
}

export async function getCurrentPositionSafe(opts?: { timeoutMs?: number; highAccuracy?: boolean }) {
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const enableHighAccuracy = opts?.highAccuracy ?? true;

  if (typeof navigator === "undefined" || !("geolocation" in navigator)) return null;

  return await new Promise<
    | { latitude: number; longitude: number; accuracy?: number }
    | null
  >((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      () => resolve(null),
      { enableHighAccuracy, timeout: timeoutMs }
    );
  });
}
