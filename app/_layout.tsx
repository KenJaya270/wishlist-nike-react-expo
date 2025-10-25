import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerTitle: "Nike Wishlist",
      headerStyle: {
        backgroundColor: "#149cac",
      },
      headerTintColor: "#fff",
      headerTitleAlign: "center",
    }}
  >

    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

  </Stack>;
}
