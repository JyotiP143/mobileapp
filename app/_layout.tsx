import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { InvestmentProvider } from "@/context/InvestmentContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar, StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView
} from "react-native-safe-area-context";
import CustomTabBar from "../components/CustomTabBar";
import { ImageProvider } from "./../context/ImageContext";
import { UserProvider } from "./../context/UserContext";

function LayoutWithInsets() {
  const colorScheme = useColorScheme();
console.log(colorScheme)
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
      ]}
    >
    <StatusBar
      barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
    />

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} />
      </Stack>
      <CustomTabBar />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <InvestmentProvider>
          <ImageProvider>
          <SafeAreaProvider>
            <LayoutWithInsets />
          </SafeAreaProvider>
          </ImageProvider>
        </InvestmentProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
