import { LinearGradient } from "expo-linear-gradient"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { LineChart } from "react-native-chart-kit"

const { width } = Dimensions.get("window")

export const LineChartCard = ({ title, data = [] }: { title: string; data: { name: string; amount: number }[] }) => {
  const labels = data.map((item) => item?.name ?? "")
  const amounts = data.map((item) => Number(item?.amount ?? 0))
  const chartData = {
    labels,
    datasets: [
      {
        data: amounts,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundColor: "#1f2937",
    backgroundGradientFrom: "#374151",
    backgroundGradientTo: "#111827",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3b82f6",
    },
  }

  return (
    <LinearGradient colors={["#3f3f3f", "#000000"]} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={width - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </LinearGradient>
  )
}

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
})
