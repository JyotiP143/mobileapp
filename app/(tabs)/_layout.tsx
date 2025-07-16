import { Stack } from "expo-router";
import React from "react";
const TabLayoutone = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
export default TabLayoutone;
