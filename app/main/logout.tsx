// Sidebar.tsx
import { usePathname, useRouter } from "expo-router";
import {
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    Dock,
    IndianRupee,
    LayoutDashboard,
    LogOut,
    Menu,
    ShieldCheck,
    User,
    Users,
    X
} from "lucide-react-native";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useUser } from "@/context/UserContext";

type SidebarNavItem = {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
};

const sidebarNavItems: SidebarNavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Loans", icon: Dock, href: "/dashboard/loans" },
  { title: "Investment", icon: IndianRupee, href: "/dashboard/investment" },
  { title: "Withdrawn", icon: CircleDollarSign, href: "/dashboard/withdrawn" },
  { title: "Members", icon: Users, href: "/dashboard/members" },
];

interface SidebarProps {
  className?: string; // Not used in RN, but kept for API parity
}

 const Sidebar: React.FC<SidebarProps> = () => {
  const { logoutUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleNavigation = (href: string) => {
    router.push(href as any);
    setIsMenuOpen(false);
  };

  return (
    <View
      style={[
        styles.sidebar,
        { width: isExpanded ? 240 : 64 }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleNavigation("/dashboard")}
          style={styles.logoContainer}
        >
          <ShieldCheck color="#6366f1" size={24} />
          {isExpanded && <Text style={styles.logoText}>EvoXcel</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={20} color="#fff" />
          ) : (
            <Menu size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Navigation Items */}
      <ScrollView style={styles.navContainer}>
        {sidebarNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          return (
            <TouchableOpacity
              key={item.href}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
                !isExpanded && styles.navItemCollapsed
              ]}
              onPress={() => handleNavigation(item.href)}
            >
              <IconComponent
                size={18}
                color={isActive ? "#fff" : "#fff"}
                style={isExpanded ? styles.navIconExpanded : styles.navIconCollapsed}
              />
              {isExpanded && (
                <Text style={[styles.navText, isActive && styles.navTextActive]}>
                  {item.title}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Profile and Logout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navItem,
            pathname === "/dashboard/profile" && styles.navItemActive,
            !isExpanded && styles.navItemCollapsed
          ]}
          onPress={() => handleNavigation("/dashboard/profile")}
        >
          <User
            size={18}
            color="#fff"
            style={isExpanded ? styles.navIconExpanded : styles.navIconCollapsed}
          />
          {isExpanded && <Text style={styles.navText}>Profile</Text>}
        </TouchableOpacity>

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

        {/* Expand / Collapse */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
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