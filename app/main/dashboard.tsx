import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
// Simple Growth Screen (without chart for now)
const GrowthScreen = () => {
  return (
    <View style={styles.growthContainer}>
      <Text style={styles.growthTitle}>Growth</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>Chart will go here</Text>
        <Text style={styles.placeholderSubtext}>
          Investment data visualization
        </Text>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ff6347" }]} />
          <Text style={styles.legendText}>Investment</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#20b2aa" }]} />
          <Text style={styles.legendText}>Withdraw</Text>
        </View>
      </View>
    </View>
  );
};

// Dashboard Screen
const DashboardScreen = () => {
  const MetricCard = ({ title, amount, icon, iconBg }: any) => (
    <View style={styles.metricCard}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricAmount}>₹ {amount}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.dashboardContainer}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <View style={styles.headerCards}>
            <View style={styles.headerCard}>
              <Text style={styles.headerCardLabel}>Total Capital:</Text>
              <Text style={styles.headerCardValue}>₹100000</Text>
            </View>
            <View style={styles.headerCard}>
              <Text style={styles.headerCardLabel}>Available Credit:</Text>
              <Text style={styles.headerCardValue}>₹91800</Text>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Loan Amount"
            amount="12000"
            icon="₹"
            iconBg="#ff6b35"
          />
          <MetricCard
            title="Total Outstanding Loan"
            amount="9000"
            icon="₹"
            iconBg="#ff6b35"
          />
          <MetricCard
            title="Principal Payment"
            amount="3000"
            icon="%"
            iconBg="#e74c3c"
          />
          <MetricCard
            title="Total Processing Fee"
            amount="400"
            icon="📄"
            iconBg="#f39c12"
          />
          <MetricCard
            title="Interest Earnings"
            amount="800"
            icon="%"
            iconBg="#9b59b6"
          />
          <MetricCard
            title="Penalty Earnings"
            amount="1000"
            icon="$"
            iconBg="#3498db"
          />
             <MetricCard
            title="Weekly OutStanding Amount"
            amount="0"
            icon="$"
            iconBg="#3498db"
          />
             <MetricCard
            title="Weekly Paid Amount"
            amount="0"
            icon="$"
            iconBg="#3498db"
          />
        </View>

        {/* Chart Placeholders */}
        <View style={styles.chartsSection}>
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Received Amount</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Line Chart</Text>
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Distribution</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Pie Chart</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// Main App
const Dashboardmain =() => {
  const [currentScreen, setCurrentScreen] = useState("Dashboardmain");

  const renderScreen = () => {
    switch (currentScreen) {
      case "growth":
        return <GrowthScreen />;
      case "dashboard":
        return <DashboardScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
  <SafeAreaView style={styles.container}>
      {renderScreen()}

      {/* Bottom Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "growth" && styles.activeNavButton,
          ]}
          onPress={() => setCurrentScreen("growth")}
        >
          <Text style={styles.navButtonText}>Growth</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "dashboard" && styles.activeNavButton,
          ]}
          onPress={() => setCurrentScreen("dashboard")}
        >
          <Text style={styles.navButtonText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default Dashboardmain;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },

  // Growth Screen
  growthContainer: {
    flex: 1,
    backgroundColor: "#1a2332",
    padding: 20,
  },
  growthTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    marginTop: 40,
  },
  chartPlaceholder: {
    backgroundColor: "#2c3e50",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholderSubtext: {
    color: "#bdc3c7",
    fontSize: 14,
    marginTop: 5,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 30,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#fff",
    fontSize: 14,
  },

  // Dashboard Screen
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  headerCards: {
    flexDirection: "row",
    gap: 15,
  },
  headerCard: {
    flex: 1,
    backgroundColor: "#2c3e50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  headerCardLabel: {
    color: "#bdc3c7",
    fontSize: 12,
    marginBottom: 5,
  },
  headerCardValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 15,
  },
  metricCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: "#2c2c2c",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    color: "#bdc3c7",
    fontSize: 12,
    marginBottom: 4,
  },
  metricAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chartsSection: {
    padding: 20,
    gap: 20,
  },
  chartSection: {
    backgroundColor: "#2c3e50",
    borderRadius: 16,
    padding: 20,
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // Navigation
  navigation: {
    flexDirection: "row",
    backgroundColor: "#2c2c2c",
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: "#3c3c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeNavButton: {
    backgroundColor: "#007AFF",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
