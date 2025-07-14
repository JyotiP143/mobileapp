import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export const PieChartCard = ({ title, data }: any) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#f472b6", "#8b5cf6", "#ec4899"];

  const chartData =
    data?.map((item: any, index: number) => ({
      name: item?.name,
      population: item?.value,
      color: colors[index % colors.length],
      legendFontColor: "#ffffff",
      legendFontSize: 12,
    })) || [];

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <LinearGradient colors={["#3f3f3f", "#000000"]} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width - 64}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
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
});
