import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Chip, Text, useTheme } from "react-native-paper";

import { apiFetch } from "../../lib/api";
import { useAuth } from "../../state/auth";
import { submitAttendance } from "../../lib/attendance";
import { promptBiometrics } from "../../lib/biometrics";

type TodayData = {
  date: string;
  status: "NONE" | "CHECKED_IN" | "CHECKED_OUT";
  canCheckIn: boolean;
  canCheckOut: boolean;
  record: any;
};

function statusLabel(status: TodayData["status"]) {
  switch (status) {
    case "CHECKED_IN":
      return "Checked in";
    case "CHECKED_OUT":
      return "Checked out";
    default:
      return "Not checked in";
  }
}

export default function HomeScreen() {
  const auth = useAuth();
  const theme = useTheme();
  const [today, setToday] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<"check-in" | "check-out" | null>(null);

  const displayName = useMemo(() => {
    if (!auth.user) return "";
    return [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ");
  }, [auth.user]);

  async function loadToday(token: string) {
    const res = await apiFetch<TodayData>("/api/mobile/attendance/today", { accessToken: token });
    setToday(res.ok ? res.data : null);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      // On first entry, try the current access token first.
      // If it's missing/expired, refresh (which may trigger biometrics).
      let token = auth.accessToken;
      if (!token) {
        token = await auth.refreshSession();
      }

      if (!token) {
        setLoading(false);
        return;
      }

      await loadToday(token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doAttendance(type: "check-in" | "check-out") {
    const token = auth.accessToken;
    if (!token) {
      Alert.alert("Session", "Please sign in again.");
      return;
    }

    if (auth.biometricsEnabled) {
      const ok = await promptBiometrics("Confirm attendance");
      if (!ok) return;
    }

    setActing(type);
    try {
      const res = await submitAttendance(token, { type });
      if (!res.ok) {
        Alert.alert("Attendance", res.error);
        return;
      }

      await loadToday(token);
    } finally {
      setActing(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleLarge" style={{ fontWeight: "700" }}>
        Welcome{displayName ? `, ${displayName}` : ""}
      </Text>

      <Card>
        <Card.Title
          title="Today"
          subtitle={loading ? "Loading…" : statusLabel(today?.status ?? "NONE")}
          right={() => (
            <View style={{ paddingRight: 12 }}>
              <Chip
                style={{ backgroundColor: theme.colors.surfaceVariant }}
                textStyle={{ fontWeight: "600" }}
              >
                {loading ? "…" : today?.status ?? "NONE"}
              </Chip>
            </View>
          )}
        />
        <Card.Content>
          <Text style={{ opacity: 0.8 }}>Tenant</Text>
          <Text style={{ fontWeight: "700", marginTop: 2 }}>
            {auth.user?.tenant?.name ?? "—"}
          </Text>
        </Card.Content>
      </Card>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          mode="contained"
          disabled={!today?.canCheckIn || acting !== null}
          loading={acting === "check-in"}
          style={{ flex: 1 }}
          onPress={() => doAttendance("check-in")}
        >
          Check in
        </Button>
        <Button
          mode="outlined"
          disabled={!today?.canCheckOut || acting !== null}
          loading={acting === "check-out"}
          style={{ flex: 1 }}
          onPress={() => doAttendance("check-out")}
        >
          Check out
        </Button>
      </View>

      <Button mode="text" onPress={() => auth.signOut()}>
        Sign out
      </Button>
    </ScrollView>
  );
}
