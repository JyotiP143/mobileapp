import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { InvestmentProvider } from "@/context/InvestmentContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomTabBar from "../components/CustomTabBar";
import { UserProvider } from "./../context/UserContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
      <InvestmentProvider>
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <CustomTabBar />
      </InvestmentProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
