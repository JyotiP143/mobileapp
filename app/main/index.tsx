"use client"
import { GrowthChart } from "@/components/analytics/GrowthChart"
import { LineChartCard } from "@/components/analytics/LineChart"
import { PieChartCard } from "@/components/analytics/PieChart"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native"
import { useInvestment } from "./../../context/InvestmentContext"
import { useUser } from "./../../context/UserContext"

const { width } = Dimensions.get("window")

export default function Dashboard() {
  const { investmentData, loading } = useInvestment()
  const { isLoading, loanData, fetchUserData } = useUser()
  
  let investment = []
  let withdraws = []
  if (!loading) {
    investment = investmentData?.investments
    withdraws = investmentData?.withdrawals
  }

  const totalUserLoan = loanData?.reduce((total, item) => total + Number.parseInt(item.loanAmount, 10), 0)
  const totalProcessingFee = loanData?.reduce((total, item) => total + Number.parseInt(item.processingFee, 10), 0)
  const totalInterest = loanData?.reduce((total, item) => {
    const loanAmount = Number.parseInt(item.loanAmount, 10)
    const totalInstallment = Number.parseInt(item.totalInstallment, 10)
    const repaymentMethod = item.repaymentMethod
    const loanInterest = Number.parseInt(item.interest, 10) / 100
    let totalWithInterest = 0
    if (repaymentMethod === "daily") {
      totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
    } else if (repaymentMethod === "weekly") {
      totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
    } else if (repaymentMethod === "monthly") {
      totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
    } else {
      throw new Error("Invalid repayment method")
    }
    const interestForLoan = totalWithInterest - loanAmount
    const totalAmount = Number(total) + interestForLoan
    return Number.parseFloat(totalAmount.toFixed(2))
  }, 0)

  const totalPaidAmount = loanData
    ?.flatMap((loan) => loan.emiHistory)
    .reduce((total, item) => {
      return item.paidStatus === "Paid" ? total + Number.parseInt(item.amount, 10) : total
    }, 0)

  const totalPaidPanalty = loanData
    ?.flatMap((loan) => loan.emiHistory)
    .reduce((total, item) => {
      return item.paidStatus === "Paid" ? total + Number(item.penaltyAmount) : total
    }, 0)

  const totalInvestment = investment?.reduce(({ total, item }: any) => total + Number.parseInt(item?.amount, 10), 0)
  const totalWithdraws = withdraws?.reduce(({ total, item }: any) => total + Number.parseInt(item.amount, 10), 0)

  const currentYear = new Date().getFullYear()
  const combinedMonthlyData = loanData?.map((loan) =>
    loan.emiHistory.reduce((acc: any, emi: any) => {
      const emiDate = new Date(emi?.paidDate)
      if (emi?.paidStatus === "Paid" && emiDate.getFullYear() === currentYear) {
        const month = emiDate.getMonth()
        const amount = Number.parseFloat(emi.amount)
        acc[month] = acc[month] ? acc[month] + amount : amount
      }
      return acc
    }, Array(12).fill(0)),
  )

  const finalMonthlyData = combinedMonthlyData?.reduce((acc, loanMonthlyData) => {
    loanMonthlyData.forEach((amount: number, month: number) => {
      acc[month] = acc[month] ? acc[month] + amount : amount;
    });
    return acc;
  }, Array(12).fill(0));

  const formattedMonthlyData = finalMonthlyData.map((amount: any, index: any) => ({
    name: new Date(0, index).toLocaleString("en-US", { month: "short" }),
    amount,
  }));

  const distributionData = [
    { name: "Interest Earnings", value: totalInterest },
    { name: "Received Payment", value: totalPaidAmount },
    { name: "Outstanding Loan", value: Number(totalUserLoan) - Number(totalPaidAmount) },
  ]

  const getCurrentWeekRange = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
    endOfWeek.setHours(23, 59, 59, 999)
    return { startOfWeek, endOfWeek }
  }

  const { startOfWeek, endOfWeek } = getCurrentWeekRange()
  const [weeklyData, setWeeklyData] = useState({ paidAmount: 0, dueAmount: 0 })

  useEffect(() => {
    if (!loanData || !Array.isArray(loanData)) return
    const calculatedData = loanData.reduce(
      (acc, loan) => {
        if (!loan.emiHistory) return acc
        loan.emiHistory.forEach((emi: any) => {
          const emiDate = new Date(emi.date)
          if (emiDate >= startOfWeek && emiDate <= endOfWeek) {
            if (emi.paidStatus === "Paid") {
              acc.paidAmount = acc.paidAmount + Number(emi.amount)
            } else if (emi.paidStatus === "Due") {
              acc.dueAmount = acc.dueAmount + Number(emi.amount)
            }
          }
        })
        return acc
      },
      { paidAmount: 0, dueAmount: 0 },
    )
    // setWeeklyData(calculatedData)
  }, [loanData])

  const StatCard = ({ icon, title, amount, iconColor, iconName, iconFamily }: any) => (
    <View style={styles.statCardWrapper}>
      <LinearGradient 
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]} 
        style={styles.statCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            {iconFamily === "MaterialIcons" && <MaterialIcons name={iconName} size={28} color={iconColor} />}
            {iconFamily === "FontAwesome5" && <FontAwesome5 name={iconName} size={28} color={iconColor} />}
            {iconFamily === "Ionicons" && <Ionicons name={iconName} size={28} color={iconColor} />}
            {iconFamily === "MaterialCommunityIcons" && (
              <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
            )}
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statTitle}>{title}</Text>
            <View style={styles.amountContainer}>
              <MaterialIcons name="currency-rupee" size={18} color="#ffffff" />
              <Text style={styles.statAmount}>{amount?.toLocaleString() || "0"}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.cardAccent, { backgroundColor: iconColor }]} />
      </LinearGradient>
    </View>
  )

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a2e", "#16213e"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Financial Dashboard</Text>
              <Text style={styles.subtitle}>Overview of your financial portfolio</Text>
            </View>
            
            <View style={styles.headerCards}>
              <LinearGradient 
                colors={["#667eea", "#764ba2"]} 
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.headerCardContent}>
                  <View style={styles.headerIconContainer}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#ffffff" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerCardTitle}>Total Capital</Text>
                    <View style={styles.headerAmountContainer}>
                      <MaterialIcons name="currency-rupee" size={16} color="#ffffff" />
                      <Text style={styles.headerCardAmount}>{totalInvestment?.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.headerCardGlow} />
              </LinearGradient>

              <LinearGradient 
                colors={["#11998e", "#38ef7d"]} 
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.headerCardContent}>
                  <View style={styles.headerIconContainer}>
                    <FontAwesome5 name="piggy-bank" size={24} color="#ffffff" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerCardTitle}>Available Credit</Text>
                    <View style={styles.headerAmountContainer}>
                      <MaterialIcons name="currency-rupee" size={16} color="#ffffff" />
                      <Text style={styles.headerCardAmount}>
                        {(Number(totalInvestment) +
                          Number(totalPaidAmount) +
                          Number(totalInterest) -
                          Number(totalUserLoan))?.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.headerCardGlow} />
              </LinearGradient>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Financial Metrics</Text>
            <View style={styles.statsGrid}>
              <StatCard
                iconName="account-balance"
                iconFamily="MaterialIcons"
                iconColor="#ff6b6b"
                title="Total Loan Amount"
                amount={totalUserLoan}
              />
              <StatCard
                iconName="trending-up"
                iconFamily="MaterialIcons"
                iconColor="#4ecdc4"
                title="Outstanding Loan"
                amount={Number(totalUserLoan) - Number(totalPaidAmount)}
              />
              <StatCard
                iconName="hand-holding-usd"
                iconFamily="FontAwesome5"
                iconColor="#45b7d1"
                title="Principal Payment"
                amount={totalPaidAmount}
              />
              <StatCard
                iconName="receipt"
                iconFamily="MaterialIcons"
                iconColor="#f9ca24"
                title="Processing Fee"
                amount={totalProcessingFee}
              />
              <StatCard
                iconName="percent"
                iconFamily="FontAwesome5"
                iconColor="#a55eea"
                title="Interest Earnings"
                amount={totalInterest}
              />
              <StatCard
                iconName="attach-money"
                iconFamily="MaterialIcons"
                iconColor="#26de81"
                title="Penalty Earnings"
                amount={totalPaidPanalty}
              />
              <StatCard
                iconName="schedule"
                iconFamily="MaterialIcons"
                iconColor="#fd79a8"
                title="Weekly Outstanding"
                amount={weeklyData.dueAmount}
              />
              <StatCard
                iconName="check-circle"
                iconFamily="MaterialIcons"
                iconColor="#00b894"
                title="Weekly Paid"
                amount={weeklyData.paidAmount}
              />
            </View>
          </View>

          {/* Charts */}
          <View style={styles.chartsSection}>
            <Text style={styles.sectionTitle}>Analytics & Insights</Text>
            <View style={styles.chartsContainer}>
              <View style={styles.chartWrapper}>
                <LineChartCard title="Received Amount" data={formattedMonthlyData} />
              </View>
              <View style={styles.chartWrapper}>
                <PieChartCard title="Distribution" data={distributionData} />
              </View>
            </View>
            
            {investment && (
              <View style={styles.chartWrapper}>
                <GrowthChart userData={investment} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "400",
  },
  headerCards: {
    gap: 16,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  headerIconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCardTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  headerAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerCardAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerCardGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  statsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  statsGrid: {
    gap: 16,
  },
  statCardWrapper: {
    marginBottom: 4,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    fontWeight: "500",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
  },
  chartsSection: {
    marginBottom: 40,
  },
  chartsContainer: {
    gap: 24,
    marginBottom: 24,
  },
  chartWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
})