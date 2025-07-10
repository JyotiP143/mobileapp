import { Stack } from "expo-router";
import React from "react";
export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup"></Stack.Screen>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
