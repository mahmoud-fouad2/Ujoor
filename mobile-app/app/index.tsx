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

  // Always start from the login screen on mobile.
  // If the user already has a saved session, the login screen will immediately
  // prompt biometrics (when enabled) and then redirect into the app.
  return <Redirect href="/(auth)/login" />;
}
