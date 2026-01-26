import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { apiFetch } from "../../lib/api";
import { useAuth } from "../../state/auth";

type TodayData = {
  date: string;
  status: "NONE" | "CHECKED_IN" | "CHECKED_OUT";
  canCheckIn: boolean;
  canCheckOut: boolean;
  record: any;
};

export default function HomeScreen() {
  const auth = useAuth();
  const [today, setToday] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // On first entry, refresh session (also triggers biometrics if enabled)
      const token = (await auth.refreshSession()) ?? auth.accessToken;

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await apiFetch<TodayData>("/api/mobile/attendance/today", {
        accessToken: token,
      });

      setToday(res.ok ? res.data : null);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleLarge" style={{ fontWeight: "700" }}>
        Welcome{auth.user?.firstName ? `, ${auth.user.firstName}` : ""}
      </Text>

      <Card>
        <Card.Title title="Today" subtitle={loading ? "Loading…" : today?.status ?? "—"} />
        <Card.Content>
          <Text>
            Tenant: {auth.user?.tenant?.name ?? "—"}
          </Text>
        </Card.Content>
      </Card>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button mode="contained" disabled={!today?.canCheckIn} style={{ flex: 1 }}>
          Check in
        </Button>
        <Button mode="outlined" disabled={!today?.canCheckOut} style={{ flex: 1 }}>
          Check out
        </Button>
      </View>

      <Button mode="text" onPress={() => auth.signOut()}>
        Sign out
      </Button>
    </ScrollView>
  );
}
