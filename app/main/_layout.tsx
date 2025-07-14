import { Stack } from "expo-router";
import React from "react";
const TabLayout = ()=>  {
  return (
<Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="investment" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="loans" />
      <Stack.Screen name="members" />
      <Stack.Screen name="withdraw" />

    </Stack>
  );
}
export default TabLayout;
