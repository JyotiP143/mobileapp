import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type IoniconName = keyof typeof Ionicons.glyphMap;
const tabs = [
  { name: "Dashboard", route: "/main", icon: "grid-outline", activeIcon: "grid" },
  { name: "Investment", route: "/main/investment", icon: "trending-up-outline", activeIcon: "trending-up" },
  { name: "Loans", route: "/main/loans", icon: "cash-outline", activeIcon: "cash" },
  { name: "Members", route: "/main/members", icon: "people-outline", activeIcon: "people" },
  { name: "Withdraw", route: "/main/withdraw", icon: "wallet-outline", activeIcon: "wallet" },
  // { name: "Profile", route: "/main/profile", icon: "person-circle-outline", activeIcon: "person-circle" },
  // { name: "Logout", route: "/main/logout", icon: "log-out-outline", activeIcon: "log-out" },
];
const moreTabs : { name: string; route: string; icon: IoniconName }[] = [
  { name: "Profile", route: "/main/profile", icon: "person-circle-outline" },
  { name: "Logout", route: "/main/logout", icon: "log-out-outline" },
];


 const CustomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [moreVisible, setMoreVisible] = useState(false);
// console.log("Current Path pathname :", pathname);
 if (pathname === "/" || pathname ==="/signup") {
    return null;
  }
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
      {/* Three Dots Button */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setMoreVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#9ca3af" />
          <Text style={styles.tabText}>More</Text>
        </TouchableOpacity>

        {/* More Menu Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={moreVisible}
        onRequestClose={() => setMoreVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMoreVisible(false)}
        >
          <View style={styles.moreMenu}>
            {moreTabs.map((tab) => (
              <TouchableOpacity
                key={tab.route}
                style={styles.moreItem}
                onPress={() => {
                  setMoreVisible(false);
                  router.push(tab.route as `/main/profile` | `/main/logout`);
                }}
              >
               <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={20} color="#3b82f6" />
                <Text style={styles.moreText}>{tab.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  moreMenu: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // flexDirection:"column",
    // alignItems:"center",
    // justifyContent:"space-between",

  },
  moreItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  moreText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#111",
  },
});
export default CustomTabBar;