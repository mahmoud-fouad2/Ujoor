import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import * as Location from "expo-location";
import * as LocalAuthentication from "expo-local-authentication";

import { useAuth } from "@/components/auth-provider";
import { useAppSettings } from "@/components/app-settings-provider";
import { apiFetch } from "@/lib/api";
import { humanizeApiError, t } from "@/lib/i18n";

type LastResult = {
  ok: boolean;
  message: string;
};

type TodayStatus = {
  status: "NONE" | "CHECKED_IN" | "CHECKED_OUT";
  canCheckIn: boolean;
  canCheckOut: boolean;
  record: {
    id: string;
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
  } | null;
};

export default function AttendanceScreen() {
  const { accessToken, user } = useAuth();
  const { language } = useAppSettings();
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<LastResult | null>(null);
  const [today, setToday] = useState<TodayStatus | null>(null);
  const [loadingToday, setLoadingToday] = useState(false);
  const [locationIssue, setLocationIssue] = useState<"PERMISSION" | "SERVICES" | null>(null);

  const header = useMemo(() => {
    const name = user ? `${user.firstName} ${user.lastName}` : "";
    return name ? `مرحبًا ${name}` : "الحضور";
  }, [user]);

  const loadToday = useCallback(async () => {
    if (!accessToken) {
      setToday(null);
      return;
    }
    setLoadingToday(true);
    setLocationIssue(null);
    try {
      const res = await apiFetch<{ data: TodayStatus }>("/api/mobile/attendance/today", {
        token: accessToken,
      });
      setToday(res.data);
    } catch (e: any) {
      setLast({ ok: false, message: humanizeApiError(language, e?.message || "") });
    } finally {
      setLoadingToday(false);
    }
  }, [accessToken, language]);

  useEffect(() => {
    void loadToday();
  }, [loadToday]);

  const doAttendance = async (type: "check-in" | "check-out") => {
    if (!accessToken) {
      setLast({ ok: false, message: humanizeApiError(language, "Unauthorized") });
      return;
    }

    setBusy(true);
    setLast(null);
    setLocationIssue(null);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: type === "check-in" ? (language === "ar" ? "تأكيد البصمة لتسجيل الحضور" : "Confirm biometrics to check in") : (language === "ar" ? "تأكيد البصمة لتسجيل الانصراف" : "Confirm biometrics to check out"),
          cancelLabel: "إلغاء",
          disableDeviceFallback: false,
        });
        if (!res.success) {
          throw new Error(language === "ar" ? "لم يتم تأكيد البصمة" : "Biometric verification failed");
        }
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationIssue("SERVICES");
        throw new Error("Location services are off");
      }

      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setLocationIssue("PERMISSION");
        throw new Error("Location permission is required");
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      await apiFetch("/api/mobile/attendance", {
        token: accessToken,
        init: {
          method: "POST",
          body: JSON.stringify({
            type,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy ?? undefined,
          }),
        },
      });

      setLast({ ok: true, message: type === "check-in" ? (language === "ar" ? "تم تسجيل الحضور" : "Checked in") : (language === "ar" ? "تم تسجيل الانصراف" : "Checked out") });
      await loadToday();
    } catch (e: any) {
      setLast({ ok: false, message: humanizeApiError(language, e?.message || "") });
    } finally {
      setBusy(false);
    }
  };

  const statusText = useMemo(() => {
    if (!today) return loadingToday ? t(language, "loading") : "";
    if (today.status === "NONE") return t(language, "status_none");
    if (today.status === "CHECKED_IN") return t(language, "status_checked_in");
    return t(language, "status_checked_out");
  }, [today, loadingToday, language]);

  const canCheckIn = !!accessToken && !busy && (today?.canCheckIn ?? true);
  const canCheckOut = !!accessToken && !busy && (today?.canCheckOut ?? true);

  const fmt = (iso: string | null | undefined) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return iso;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{header}</Text>
      <Text style={styles.subtitle}>{t(language, "attendance_subtitle")}</Text>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{t(language, "today")}</Text>
          <Pressable onPress={() => void loadToday()} disabled={loadingToday || busy} style={styles.refreshBtn}>
            {loadingToday ? <ActivityIndicator color="#fff" /> : <Text style={styles.refreshText}>{t(language, "refresh")}</Text>}
          </Pressable>
        </View>
        <Text style={styles.statusValue}>{statusText}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{t(language, "last_check_in")}: {fmt(today?.record?.checkInTime)}</Text>
          <Text style={styles.metaText}>{t(language, "last_check_out")}: {fmt(today?.record?.checkOutTime)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => void doAttendance("check-in")}
          disabled={!canCheckIn}
          style={[styles.button, styles.checkIn, !canCheckIn && styles.buttonDisabled]}
        >
          {busy ? <ActivityIndicator color="#0b1220" /> : <Text style={styles.buttonText}>{t(language, "check_in")}</Text>}
        </Pressable>

        <Pressable
          onPress={() => void doAttendance("check-out")}
          disabled={!canCheckOut}
          style={[styles.button, styles.checkOut, !canCheckOut && styles.buttonDisabled]}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, styles.buttonTextAlt]}>{t(language, "check_out")}</Text>}
        </Pressable>
      </View>

      {last ? (
        <View style={[styles.alert, last.ok ? styles.alertOk : styles.alertErr]}>
          <Text style={styles.alertText}>{last.message}</Text>

          {(!last.ok && (locationIssue === "PERMISSION" || locationIssue === "SERVICES")) ? (
            <View style={styles.alertActions}>
              <Pressable
                onPress={() => void Linking.openSettings()}
                style={[styles.smallBtn, styles.smallBtnPrimary]}
              >
                <Text style={styles.smallBtnText}>{t(language, "open_settings")}</Text>
              </Pressable>
              <Pressable
                onPress={() => void loadToday()}
                style={[styles.smallBtn, styles.smallBtnSecondary]}
              >
                <Text style={styles.smallBtnText}>{t(language, "try_again")}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.note}>
        <Text style={styles.noteText}>
          {language === "ar"
            ? "إذا تم تفعيل geofence للشركة، التسجيل خارج المواقع المسموحة سيتم رفضه."
            : "If geofence is enabled, requests outside allowed locations will be rejected."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b1220",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 6,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  statusCard: {
    marginTop: 8,
    marginBottom: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
  },
  refreshBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  refreshText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  statusValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },
  metaRow: {
    marginTop: 8,
    gap: 4,
  },
  metaText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIn: {
    backgroundColor: "#22c55e",
  },
  checkOut: {
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0b1220",
  },
  buttonTextAlt: {
    color: "#fff",
  },
  alert: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertOk: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.35)",
  },
  alertErr: {
    backgroundColor: "rgba(248,113,113,0.10)",
    borderColor: "rgba(248,113,113,0.30)",
  },
  alertText: {
    color: "#fff",
  },
  alertActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  smallBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  smallBtnPrimary: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  smallBtnSecondary: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  smallBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  note: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  noteText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
  },
});
