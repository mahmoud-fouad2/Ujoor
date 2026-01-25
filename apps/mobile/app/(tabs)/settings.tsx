import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/components/auth-provider";
import { useAppSettings } from "@/components/app-settings-provider";
import { humanizeApiError, t } from "@/lib/i18n";
import { useState } from "react";

export default function SettingsScreen() {
  const { user, signOut, accessToken, authFetch } = useAuth();
  const { language, setLanguage } = useAppSettings();
  const [message, setMessage] = useState<string | null>(null);

  const signOutAll = async () => {
    setMessage(null);
    try {
      if (accessToken) {
        await authFetch("/api/mobile/auth/logout-all", { method: "POST" });
      }
      await signOut();
    } catch (e: any) {
      setMessage(humanizeApiError(language, e?.message || ""));
    }
  };

  return (
    <View style={styles.container}>
      <BrandLogo style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.title}>{t(language, "settings_title")}</Text>

        {user ? (
          <Text style={styles.meta}>
            {user.firstName} {user.lastName} • {user.email}
          </Text>
        ) : (
          <Text style={styles.meta}>غير مسجل الدخول</Text>
        )}

        <Pressable onPress={() => void signOut()} style={[styles.button, styles.logout]}>
          <Text style={styles.buttonText}>{t(language, "logout")}</Text>
        </Pressable>

        <Pressable onPress={() => void signOutAll()} style={[styles.button, styles.logoutAll]}>
          <Text style={styles.buttonText}>{t(language, "logout_all")}</Text>
        </Pressable>

        {message ? <Text style={styles.msg}>{message}</Text> : null}

        <View style={styles.sep} />

        <Text style={styles.sectionTitle}>{t(language, "language")}</Text>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => void setLanguage("ar")}
            style={[styles.langBtn, language === "ar" && styles.langBtnActive]}
          >
            <Text style={styles.langText}>{t(language, "arabic")}</Text>
          </Pressable>
          <Pressable
            onPress={() => void setLanguage("en")}
            style={[styles.langBtn, language === "en" && styles.langBtnActive]}
          >
            <Text style={styles.langText}>{t(language, "english")}</Text>
          </Pressable>
        </View>

        <Text style={styles.restartHint}>{t(language, "restart_required")}</Text>
      </View>

      <Text style={styles.hint}>
        {language === "ar" ? "سيتم إضافة الثيم وباقي الإعدادات هنا." : "Theme and more settings will be added here."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b1220",
  },
  logo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  meta: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 6,
    marginBottom: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logout: {
    backgroundColor: "rgba(248,113,113,0.18)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
  },
  logoutAll: {
    marginTop: 10,
    backgroundColor: "rgba(248,113,113,0.10)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  msg: {
    marginTop: 10,
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginVertical: 14,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "800",
    marginBottom: 10,
  },
  langRow: {
    flexDirection: "row",
    gap: 10,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
  },
  langBtnActive: {
    borderColor: "rgba(34,197,94,0.45)",
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  langText: {
    color: "#fff",
    fontWeight: "800",
  },
  restartHint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
  },
  hint: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
});
