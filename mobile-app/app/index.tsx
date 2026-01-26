import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../state/auth";

export default function Index() {
  const auth = useAuth();

  if (auth.status === "boot") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (auth.status === "signedIn") {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
