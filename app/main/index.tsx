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
  const { isLoading, loanData,fetchUserData} = useUser()

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

  const totalInvestment = investment?.reduce(({total, item}:any) => total + Number.parseInt(item?.amount, 10), 0)
 

  const totalWithdraws = withdraws?.reduce(({total, item}:any) => total + Number.parseInt(item.amount, 10), 0)

  const currentYear = new Date().getFullYear()
  const combinedMonthlyData = loanData?.map((loan) =>
    loan.emiHistory.reduce((acc:any, emi:any) => {
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

 const formattedMonthlyData = finalMonthlyData.map((amount:any, index:any) => ({
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
        loan.emiHistory.forEach((emi:any) => {
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

  const StatCard = ({ icon, title, amount, iconColor, iconName, iconFamily } :any) => (
    <LinearGradient colors={["#3f3f3f", "#000000"]} style={styles.statCard}>
      <View style={styles.statCardContent}>
        <LinearGradient colors={["#000000", "#5a5a5a"]} style={styles.iconContainer}>
          {iconFamily === "MaterialIcons" && <MaterialIcons name={iconName} size={24} color={iconColor} />}
          {iconFamily === "FontAwesome5" && <FontAwesome5 name={iconName} size={24} color={iconColor} />}
          {iconFamily === "Ionicons" && <Ionicons name={iconName} size={24} color={iconColor} />}
          {iconFamily === "MaterialCommunityIcons" && (
            <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
          )}
        </LinearGradient>
        <View style={styles.statTextContainer}>
          <Text style={styles.statTitle}>{title}</Text>
          <View style={styles.amountContainer}>
            <MaterialIcons name="currency-rupee" size={16} color="#ffffff" />
            <Text style={styles.statAmount}>{amount?.toLocaleString() || "0"}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  )

  return (
    <LinearGradient
      colors={["#242424", "#565656"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.headerCards}>
              <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.headerCard}>
                <View style={styles.headerCardContent}>
                  <View style={[styles.headerIconContainer, { backgroundColor: "rgba(59, 130, 246, 0.3)" }]}>
                    <MaterialIcons name="account-balance-wallet" size={16} color="#60a5fa" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerCardTitle}>Total Capital:</Text>
                    <View style={styles.headerAmountContainer}>
                      <MaterialIcons name="currency-rupee" size={14} color="#60a5fa" />
                      <Text style={styles.headerCardAmount}>{totalInvestment}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              <LinearGradient colors={["#166534", "#22c55e"]} style={styles.headerCard}>
                <View style={styles.headerCardContent}>
                  <View style={[styles.headerIconContainer, { backgroundColor: "rgba(34, 197, 94, 0.3)" }]}>
                    <FontAwesome5 name="piggy-bank" size={16} color="#4ade80" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerCardTitle}>Available Credit:</Text>
                    <View style={styles.headerAmountContainer}>
                      <MaterialIcons name="currency-rupee" size={14} color="#4ade80" />
                      <Text style={styles.headerCardAmount}>
                        {Number(totalInvestment) +
                          Number(totalPaidAmount) +
                          Number(totalInterest) -
                          Number(totalUserLoan)}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              iconName="account-balance"
              iconFamily="MaterialIcons"
              iconColor="#fb923c"
              title="Total Loan Amount"
              amount={totalUserLoan}
            />
            <StatCard
              iconName="account-balance"
              iconFamily="MaterialIcons"
              iconColor="#fb923c"
              title="Total Outstanding Loan"
              amount={Number(totalUserLoan) - Number(totalPaidAmount)}
            />
            <StatCard
              iconName="hand-holding-usd"
              iconFamily="FontAwesome5"
              iconColor="#f472b6"
              title="Principal Payment"
              amount={totalPaidAmount}
            />
            <StatCard
              iconName="receipt"
              iconFamily="MaterialIcons"
              iconColor="#facc15"
              title="Total Processing Fee"
              amount={totalProcessingFee}
            />
            <StatCard
              iconName="percent"
              iconFamily="FontAwesome5"
              iconColor="#a855f7"
              title="Interest Earnings"
              amount={totalInterest}
            />
            <StatCard
              iconName="attach-money"
              iconFamily="MaterialIcons"
              iconColor="#3b82f6"
              title="Penalty Earnings"
              amount={totalPaidPanalty}
            />
            <StatCard
              iconName="attach-money"
              iconFamily="MaterialIcons"
              iconColor="#3b82f6"
              title="Weekly Outstanding Amount"
              amount={weeklyData.dueAmount}
            />
            <StatCard
              iconName="attach-money"
              iconFamily="MaterialIcons"
              iconColor="#3b82f6"
              title="Weekly Paid Amount"
              amount={weeklyData.paidAmount}
            />
          </View>

          {/* Charts */}
          <View style={styles.chartsContainer}>
            <LineChartCard title="Received Amount" data={formattedMonthlyData} />
            <PieChartCard title="Distribution" data={distributionData} />
          </View>
          

          <View style={styles.chartsContainer}>
            {investment &&(
            <GrowthChart userData ={investment} />
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
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  headerCards: {
    flexDirection: "column",
    gap: 8,
  },
  headerCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    padding: 12,
  },
  headerCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCardTitle: {
    fontSize: 12,
    color: "#ffffff",
  },
  headerAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  headerCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: width < 768 ? (width - 48) / 2 : (width - 80) / 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    padding: 20,
  },
  statCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: "#ffffff",
    marginBottom: 4,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  chartsContainer: {
    gap: 24,
    marginBottom: 32,
  },
})
