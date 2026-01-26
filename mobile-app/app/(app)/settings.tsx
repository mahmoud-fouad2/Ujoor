import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Switch, Text } from "react-native-paper";

import { useAuth } from "../../state/auth";

export default function SettingsScreen() {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);

  async function toggleBiometrics(next: boolean) {
    setBusy(true);
    try {
      if (next) {
        const res = await auth.enableBiometrics();
        if (!res.ok) {
          Alert.alert("Biometrics", res.error);
        }
      } else {
        await auth.disableBiometrics();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card>
        <Card.Title title="Security" />
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text variant="titleMedium">Unlock with biometrics</Text>
              <Text style={{ opacity: 0.7, marginTop: 4 }}>
                Require fingerprint / FaceID to unlock your session.
              </Text>
            </View>
            <Switch
              value={auth.biometricsEnabled}
              onValueChange={(v) => toggleBiometrics(v)}
              disabled={busy}
            />
          </View>
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={() => auth.signOut()}>
        Sign out
      </Button>
    </ScrollView>
  );
}
