import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { useAuth } from "../../state/auth";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await auth.signIn(email.trim(), password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace("/(app)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#0B1220", "#111827", "#0B1220"]}
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 72 }}
      >
        <Text variant="headlineMedium" style={{ color: "white", fontWeight: "700" }}>
          Ujoors
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.75)", marginTop: 8 }}>
          Sign in to your account
        </Text>

        <View
          style={{
            marginTop: 24,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textColor="white"
            outlineColor="rgba(255,255,255,0.25)"
            activeOutlineColor={theme.colors.primary}
            style={{ backgroundColor: "transparent" }}
          />

          <View style={{ height: 12 }} />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textColor="white"
            outlineColor="rgba(255,255,255,0.25)"
            activeOutlineColor={theme.colors.primary}
            style={{ backgroundColor: "transparent" }}
          />

          {error ? (
            <Text style={{ color: theme.colors.error, marginTop: 10 }}>{error}</Text>
          ) : null}

          <View style={{ height: 16 }} />

          <Button
            mode="contained"
            onPress={onSubmit}
            loading={loading}
            disabled={loading}
            contentStyle={{ height: 48 }}
            style={{ borderRadius: 12 }}
          >
            Sign in
          </Button>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
