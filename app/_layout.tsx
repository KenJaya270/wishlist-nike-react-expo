import Airbridge from "airbridge-react-native-sdk";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    if (Airbridge && (Airbridge as any).init) {
      (Airbridge as any).init("wishlistapp", "1e44ab047e4141e1b89f109015e8c44c");
    } else {
      console.log("Airbridge is not available");
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
