import { useInvestment } from "@/context/InvestmentContext";
import { Calendar, IndianRupee, TrendingUp } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LoanData = {
  loanAmount: string;
  totalInstallment: string;
  repaymentMethod: string;
  interest: string;
};


type Props = {
  loanData: LoanData[];

};

const InvestmentSummary: React.FC<Props> = ({ loanData, userData }:any) => {
  const { investmentData } = useInvestment();
  const [totalInvest, setTotalInvest] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [joinedYear, setJoinedYear] = useState("");
  const [totalYear, setTotalYear] = useState(0);

  useEffect(() => {
    const total = investmentData?.investments?.reduce(
      (sum: number, item: any) => sum + Number(item.amount),
      0
    );

    const interest = loanData?.reduce((sum:number, item:any) => {
      const loanAmount = parseInt(item.loanAmount, 10);
      const totalInstallment = parseInt(item.totalInstallment, 10);
      const rate = parseInt(item.interest, 10) / 100;
      const validMethod = ["daily", "weekly", "monthly"].includes(item.repaymentMethod);

      if (!validMethod) return sum;

      const totalWithInterest = loanAmount + loanAmount * rate * totalInstallment;
      const interestForLoan = totalWithInterest - loanAmount;

      return sum + interestForLoan;
    }, 0);

    const joinDate = new Date(userData.userData.joinDate);
    console.log("Raw joinDate:", userData.userData.joinDate);
    const now = new Date();
  
    
    const yearsDiff = now.getFullYear() - joinDate.getFullYear();
    console.log("yearsDiff.." ,yearsDiff)
    const isFullYear =
      now.getMonth() > joinDate.getMonth() ||
      (now.getMonth() === joinDate.getMonth() && now.getDate() >= joinDate.getDate());
console.log("isFullYear...", isFullYear)
    const duration = isFullYear ? yearsDiff : yearsDiff - 1;
console.log("duration...", duration)  
    setTotalInvest(total || 0);
    setTotalInterest(parseFloat((interest || 0).toFixed(2)));
    setJoinedYear(joinDate.getFullYear().toString());
    setTotalYear(duration);
  
  }, [loanData, investmentData]);

  const chartBars = [40, 30, 50, 28, 59, 43];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Total Investment */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Total Investment </Text>
          <IndianRupee size={18} color="#8e88ff" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.amount}>₹ {totalInvest}</Text>
          <View style={styles.chart}>
            {chartBars.map((height, index) => (
              <View
                key={index}
                style={[styles.bar, { height, backgroundColor: "#8e88ff" }]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Returns Earned */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Returns Earned</Text>
          <TrendingUp size={18} color="#4be787" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.amount}>₹ {totalInterest}</Text>
          <View style={styles.chart}>
            {chartBars.map((height, index) => (
              <View
                key={index}
                style={[styles.bar, { height, backgroundColor: "#4be787" }]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Active Duration */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Active Duration</Text>
          <Calendar size={18} color="#ccc" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.amount}>{totalYear} Years</Text>
          <Text style={styles.subText}>Member since {joinedYear}</Text>
          <View style={styles.chart}>
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <View
                key={m}
                style={[styles.bar, { height: m * 10, backgroundColor: "#ccc" }]}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#000",
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  cardContent: {
    paddingTop: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 12,
    height: 60,
  },
  bar: {
    width: Dimensions.get("window").width / 8 - 4,
    borderRadius: 4,
  },
});

export default InvestmentSummary;
