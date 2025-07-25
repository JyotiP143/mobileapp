"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { IndianRupee, TrendingUp, Calendar } from "lucide-react-native"

// Mock contexts for v0 preview
import { useInvestment } from "@/context/InvestmentContext"

// Define types for props and data
interface Investment {
  id: string
  amount: string
  date: string
}

interface LoanItem {
  loanAmount: string
  totalInstallment: string
  repaymentMethod: "daily" | "weekly" | "monthly"
  interest: string
}

interface UserData {
  joinDate: string // Assuming ISO string or similar
}

interface InvestmentSummaryProps {
  loanData: LoanItem[]
  userData: UserData
}

interface ChartDataItem {
  name: string
  value: number
}

const data: ChartDataItem[] = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 430 },
]

// Custom Card component for React Native
interface CustomCardProps {
  children: React.ReactNode
  title: string
  icon: React.ElementType
  iconColor: string
}

const CustomCard = ({ children, title, icon: Icon, iconColor }: CustomCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Icon size={16} color={iconColor} />
    </View>
    <View style={styles.cardContent}>{children}</View>
  </View>
)

// Simple Bar Chart for React Native
interface SimpleBarChartProps {
  data: ChartDataItem[]
  fillColor: string
}

const SimpleBarChart = ({ data, fillColor }: SimpleBarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value))
  const chartHeight = 60 // Fixed height for the chart area

  return (
    <View style={styles.barChartContainer}>
      {data.map((item, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: (item.value / maxValue) * chartHeight, // Scale bar height
              backgroundColor: fillColor,
            },
          ]}
        />
      ))}
    </View>
  )
}

export function InvestmentSummary({ loanData, userData }: InvestmentSummaryProps) {
  const { investmentData } = useInvestment()
  const [totalInvest, setTotalInvest] = useState<number>(0)
  const [totalInterest, setTotalInterest] = useState<number>(0)
  const [joinedYear, setJoinedYear] = useState<number | string>("")
  const [totalYear, setTotalYear] = useState<number | string>("")

  useEffect(() => {
    const total = investmentData?.investments?.reduce(({sum, item} :any) => sum + Number(item.amount), 0) || 0
    setTotalInvest(total)

    const calculatedTotalInterest =
      loanData?.reduce((totalAcc, item) => {
        const loanAmount = Number.parseInt(item.loanAmount, 10)
        const totalInstallment = Number.parseInt(item.totalInstallment, 10)
        const repaymentMethod = item.repaymentMethod
        const loanInterest = Number.parseInt(item.interest, 10) / 100
        let totalWithInterest = 0

        if (repaymentMethod === "daily" || repaymentMethod === "weekly" || repaymentMethod === "monthly") {
          totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
        } else {
          console.error("Invalid repayment method:", repaymentMethod)
          return totalAcc // Skip this item if method is invalid
        }
        const interestForLoan = totalWithInterest - loanAmount
        return Number.parseFloat((totalAcc + interestForLoan).toFixed(2))
      }, 0) || 0
    setTotalInterest(calculatedTotalInterest)

    if (userData?.joinDate) {
      const yearSince = new Date(userData.joinDate)
      setJoinedYear(yearSince.getUTCFullYear())

      const now = new Date()
      const yearsDifference = now.getUTCFullYear() - yearSince.getUTCFullYear()
      const monthsDifference = now.getMonth() - yearSince.getMonth()
      const isCompleteYear =
        monthsDifference < 0 || (monthsDifference === 0 && now.getDate() < yearSince.getDate())
          ? yearsDifference - 1
          : yearsDifference
      setTotalYear(isCompleteYear)
    }
  }, [loanData, investmentData, userData])

  return (
    <View style={styles.container}>
      <CustomCard title="Total Investment" icon={IndianRupee} iconColor="#8e88ff">
        <Text style={styles.mainValue}>₹ {totalInvest}</Text>
        <Text style={styles.subText}>.</Text>
        <SimpleBarChart data={data} fillColor="#8884d8" />
      </CustomCard>

      <CustomCard title="Returns Earned" icon={TrendingUp} iconColor="#4be787">
        <Text style={styles.mainValue}>₹ {totalInterest}</Text>
        <Text style={styles.subText}>.</Text>
        <SimpleBarChart data={data} fillColor="#82ca9d" />
      </CustomCard>

      <CustomCard title="Active Duration" icon={Calendar} iconColor="#9ca3af">
        <Text style={styles.mainValue}>{totalYear} Years</Text>
        <Text style={styles.subText}>Member since {joinedYear}</Text>
        <View style={styles.durationBarsContainer}>
          {[1, 2, 3, 4, 5, 6].map((month) => (
            <View key={month} style={[styles.durationBar, { height: month * 10 }]} />
          ))}
        </View>
      </CustomCard>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
    backgroundColor: "#1a1a1a", // Dark background for the whole screen
  },
  card: {
    backgroundColor: "#2d2d2d", // Darker gray for cards
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e0e0e0", // Light gray for titles
  },
  cardContent: {
    // No specific styles needed here, children will define their own layout
  },
  mainValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // White for main values
  },
  subText: {
    fontSize: 12,
    color: "#a0a0a0", // Muted gray for sub-text
    marginTop: 4,
  },
  barChartContainer: {
    flexDirection: "row",
    height: 60, // Fixed height for the chart area
    marginTop: 16,
    alignItems: "flex-end", // Bars start from the bottom
    gap: 4, // Space between bars
  },
  bar: {
    flex: 1, // Distribute space evenly
    borderRadius: 2, // Rounded top corners
  },
  durationBarsContainer: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "flex-end",
    gap: 4,
    height: 60, // Fixed height for the duration bars
  },
  durationBar: {
    backgroundColor: "#9ca3af", // Gray for duration bars
    borderRadius: 2,
    width: Dimensions.get("window").width / 6 - 20, // Approximate width for 6 bars with padding
  },
})
