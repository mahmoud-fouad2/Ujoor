import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

import { apiFetch } from "../../lib/api";
import { useAuth } from "../../state/auth";

type MeResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  tenantId: string | null;
  tenant?: { id: string; slug: string; name: string; nameAr: string | null; status: string; plan: string } | null;
};

export default function MeScreen() {
  const auth = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    (async () => {
      if (!auth.accessToken) return;
      const res = await apiFetch<MeResponse>("/api/mobile/me", { accessToken: auth.accessToken });
      setMe(res.ok ? res.data : null);
    })();
  }, [auth.accessToken]);

  const fullName = me ? `${me.firstName} ${me.lastName}` : "—";

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card>
        <Card.Title
          title={fullName}
          subtitle={me?.email ?? ""}
          left={(props) => <Avatar.Text {...props} label={(me?.firstName?.[0] ?? "U").toUpperCase()} />}
        />
        <Card.Content>
          <Text>Role: {me?.role ?? "—"}</Text>
          <Text>Tenant: {me?.tenant?.name ?? "—"}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
