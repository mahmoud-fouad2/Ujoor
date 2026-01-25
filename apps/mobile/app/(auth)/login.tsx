import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "@/components/auth-provider";
import { BrandLogo } from "@/components/brand-logo";
import { useAppSettings } from "@/components/app-settings-provider";
import { humanizeApiError, t } from "@/lib/i18n";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { language } = useAppSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(humanizeApiError(language, e?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.root}
    >
      <View style={styles.card}>
        <BrandLogo style={styles.logo} />
        <Text style={styles.title}>{t(language, "login_title")}</Text>
        <Text style={styles.subtitle}>{t(language, "login_subtitle")}</Text>

        <Text style={styles.label}>{t(language, "email_label")}</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="name@company.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>{t(language, "password_label")}</Text>
        <TextInput
          secureTextEntry
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={() => void submit()}
          disabled={submitting || email.trim().length === 0 || password.length === 0}
          style={[styles.button, (submitting || email.trim().length === 0 || password.length === 0) && styles.buttonDisabled]}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t(language, "sign_in")}</Text>}
        </Pressable>

        <Text style={styles.hint}>
          {t(language, "dev_base_url_hint")}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  logo: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 6,
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 12,
  },
  error: {
    color: "#f87171",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#0b1220",
    fontWeight: "800",
    fontSize: 16,
  },
  hint: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
});
