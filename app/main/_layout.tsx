
import { Stack } from "expo-router";
import React from "react";
const TabLayout = ()=>  {
  return (
<Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="investment" />
      <Stack.Screen name="loans" />
      <Stack.Screen name="members" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="profile" />
    
    </Stack>
  );
}
export default TabLayout;
