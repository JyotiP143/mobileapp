import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const GrowthChart = ({ userData }: { userData: any[] }) => {
  const monthlyTotals = Array(12).fill(0);

  userData?.forEach((entry: any) => {
    const date = new Date(entry.date);
    const amount = Number(entry.amount);
    const monthIndex = date.getMonth();

    if (!isNaN(monthIndex) && !isNaN(amount)) {
      monthlyTotals[monthIndex] += amount;
    }
  });

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        data: monthlyTotals,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#1f2937",
    backgroundGradientFrom: "#374151",
    backgroundGradientTo: "#111827",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.5,
  };

  return (
    <LinearGradient colors={["#3f3f3f", "#000000"]} style={styles.container}>
      <Text style={styles.title}>Growth Chart</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={width - 64}
          height={220}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
  },
});
