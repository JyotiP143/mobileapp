import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "Dashboard", route: "/main", icon: "grid-outline", activeIcon: "grid" },
  { name: "Investment", route: "/main/investment", icon: "trending-up-outline", activeIcon: "trending-up" },
  { name: "Loans", route: "/main/loans", icon: "cash-outline", activeIcon: "cash" },
  { name: "Members", route: "/main/members", icon: "people-outline", activeIcon: "people" },
  { name: "Withdraw", route: "/main/withdraw", icon: "wallet-outline", activeIcon: "wallet" },
];

 const CustomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab :any) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            onPress={() => router.push(tab.route)}
            style={[styles.tabButton, isActive && styles.activeTab]}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? "#3b82f6" : "#9ca3af"}
            />
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#374151",
    marginBottom:40,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  activeText: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  activeTab: {
    borderTopWidth: 2,
    borderColor: "#3b82f6",
    paddingTop: 8,
  },
});
export default CustomTabBar;