// Sidebar.tsx

import {
  LogOut
} from "lucide-react-native";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useUser } from "@/context/UserContext";
interface SidebarProps {
  className?: string; 
}

 const Sidebar: React.FC<SidebarProps> = () => {
  const { logoutUser } = useUser();
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <View
      style={[
        styles.sidebar,
        { width: isExpanded ? 240 : 64 }
      ]}
    >
      {/* Profile and Logout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navItem,
            !isExpanded && styles.navItemCollapsed
          ]}
          onPress={logoutUser}
        >
          <LogOut
            size={18}
            color="red"
            style={isExpanded ? styles.navIconExpanded : styles.navIconCollapsed}
          />
          {isExpanded && <Text style={[styles.navText, { color: "red" }]}>Logout</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "#1e1b22",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  menuButton: {
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 6,
  },
  navContainer: {
    marginTop: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  navItemActive: {
    backgroundColor: "#2563eb",
  },
  navItemCollapsed: {
    justifyContent: "center",
  },
  navIconExpanded: {
    marginRight: 8,
  },
  navIconCollapsed: {
    marginRight: 0,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
  },
  navTextActive: {
    color: "#fff",
  },
  footer: {
    marginBottom: 20,
  },
  toggleButton: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
  },
});
export default Sidebar;