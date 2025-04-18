import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Accueil" }} />
      <Stack.Screen name="timer" options={{ title: "Chrono" }} />
      <Stack.Screen name="sessions" options={{ title: "Séances" }} />
    </Stack>
  );
}