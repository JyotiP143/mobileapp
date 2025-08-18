"use client"

import { Documents } from "@/components/loan/Documents"
import { GeneralInfo } from "@/components/loan/GeneralInfo"
import { PaymentHistory } from "@/components/loan/PaymentHistory"
import { PaymentSchedule } from "@/components/loan/PaymentSchedule"
import LoanDetailsSkeleton from "@/components/loan/skeleton/LoanDetailsSkeleton"
import { useImageContext } from "@/context/ImageContext"
import { useUser } from "@/context/UserContext"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useEffect, useState } from "react"
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")

type RootStackParamList = {
  LoanDetails: { id: string }
  Loans: undefined
}

type LoanDetailsScreenRouteProp = RouteProp<RootStackParamList, "LoanDetails">
type LoanDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, "LoanDetails">

interface Props {
  route: LoanDetailsScreenRouteProp
  navigation: LoanDetailsScreenNavigationProp
}

const LoanDetailsScreen: React.FC<Props> = () => {
  const route = useRoute<LoanDetailsScreenRouteProp>()
  const navigation = useNavigation<LoanDetailsScreenNavigationProp>()
  const { id } = route.params
  const decodedId = atob(id)

  const { fetchImages } = useImageContext()
  const { setLoanData, loanData, loanisLoading } = useUser()
  const [initialLoanData, setInitialLoanData] = useState<any>(null)
  const [penaltyAmount, setPenaltyAmount] = useState("0")
  const [selectedLoan, setSelectedLoan] = useState("")
  const [activeTab, setActiveTab] = useState("schedule")

  useEffect(() => {
    if (!loanisLoading && loanData.length > 0) {
      const firstLoan = loanData.find((loan: any) => loan._id === decodedId)
      if (firstLoan) {
        fetchImages(firstLoan.customerId, firstLoan.owner)
        setInitialLoanData(firstLoan)
        setSelectedLoan(firstLoan.loanId)
        const total = firstLoan.emiHistory.reduce((total: number, item: any) => {
          return item.paidStatus === "Paid" ? total + Number.parseInt(item.amount, 10) : total
        }, 0)
        const OutstandingLoan = Number(firstLoan.loanAmount) - total
        setPenaltyAmount(OutstandingLoan.toString())
      }
    }
  }, [loanData, loanisLoading, decodedId])

  const totalPaidAmount = (loanID: string) => {
    const loan = loanData.find((item: any) => item.loanId === loanID)
    if (!loan) return 0

    const total = loan.emiHistory.reduce((total: number, item: any) => {
      return item.paidStatus === "Paid" ? total + Number.parseInt(item.amount, 10) : total
    }, 0)
    const OutstandingLoan = Number(loan.loanAmount) - total
    setPenaltyAmount(OutstandingLoan.toString())
    return total
  }

  const handleTheLoan = (loanID: string) => {
    const selectedLoan = loanData.find((item: any) => item.loanId === loanID)
    if (selectedLoan) {
      totalPaidAmount(loanID)
      setInitialLoanData(selectedLoan)
      setSelectedLoan(loanID)
    }
  }

  const totalAmount = () => {
    if (!initialLoanData) {
      return 0
    }

    const { repaymentMethod, totalInstallment, loanAmount, interest } = initialLoanData
    const parsedTotalInstallment = Number(totalInstallment)
    const parsedLoanAmount = Number(loanAmount)
    const parsedInterest = Number(interest) / 100

    let totalWithInterest = 0

    if (repaymentMethod === "daily") {
      totalWithInterest = parsedLoanAmount + parsedLoanAmount * parsedInterest * parsedTotalInstallment
    } else if (repaymentMethod === "weekly") {
      totalWithInterest = parsedLoanAmount + parsedLoanAmount * parsedInterest * parsedTotalInstallment
    } else if (repaymentMethod === "monthly") {
      totalWithInterest = parsedLoanAmount + parsedLoanAmount * parsedInterest * parsedTotalInstallment
    }

    const roundedTotal = Number.parseFloat(totalWithInterest.toFixed(2))
    return roundedTotal
  }

  if (loanisLoading || !initialLoanData) {
    return <LoanDetailsSkeleton />
  }

  const loanId = loanData.find((item: any) => item._id === decodedId)
  const userLoanData = loanData.filter((item: any) => item.customerId === loanId.customerId)
  const loanMethod =
    initialLoanData.repaymentMethod === "weekly"
      ? "Week"
      : initialLoanData.repaymentMethod === "daily"
        ? "Day"
        : "Month"

  const formatCurrency = (amount: number | string) => {
    return Number(amount).toLocaleString("en-IN")
  }

  const tabs = [
    { key: "general", title: "General Info" },
    { key: "schedule", title: "Payment Schedule" },
    { key: "history", title: "History" },
    { key: "documents", title: "Documents" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralInfo loanData={initialLoanData} payLoanmethod={loanMethod} setLoanData={setLoanData} />
      case "schedule":
        return <PaymentSchedule loanData={initialLoanData} />
      case "history":
        return <PaymentHistory loanData={initialLoanData} />
      case "documents":
        return <Documents loanData={initialLoanData} />
      default:
        return <PaymentSchedule loanData={initialLoanData} />
    }
  }

  const renderLoanItem = ({ item }: { item: any }) => {
    const encodedId = btoa(item._id)
    const isSelected = selectedLoan === item.loanId

    return (
      <TouchableOpacity
        style={[styles.loanItem, isSelected && styles.selectedLoanItem]}
        onPress={() => {
          handleTheLoan(item.loanId)
          navigation.setParams({ id: encodedId })
        }}
      >
        <Text style={styles.loanId}>{item.loanId}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.rupeeSymbol}>₹</Text>
          <Text style={styles.amount}>{formatCurrency(item.loanAmount)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Loans")}>
              <Ionicons name="arrow-back" size={20} color="#374151" />
              <Text style={styles.backText}>Back to Loans</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.customerName}>{initialLoanData.name}</Text>
              <View style={styles.loanIdBadge}>
                <Text style={styles.loanIdBadgeText}>Loan ID: {initialLoanData.loanId}</Text>
              </View>
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* Metrics Card */}
            <View style={styles.metricsCard}>
              <View style={styles.metricsGrid}>
                {/* Total Loan Amount */}
                <View style={[styles.metricItem, styles.loanAmountBg]}>
                  <Text style={styles.metricLabel}>Total Loan Amount</Text>
                  <View style={styles.metricValue}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
                    <Text style={styles.metricAmount}>{formatCurrency(initialLoanData.loanAmount)}</Text>
                  </View>
                </View>

                {/* Total Repayment */}
                <View style={[styles.metricItem, styles.repaymentBg]}>
                  <Text style={styles.metricLabel}>Total Repayment</Text>
                  <View style={styles.metricValue}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
                    <Text style={styles.metricAmount}>{formatCurrency(totalAmount())}</Text>
                  </View>
                </View>

                {/* Outstanding Balance */}
                <View style={[styles.metricItem, styles.outstandingBg]}>
                  <Text style={styles.metricLabel}>Outstanding Balance</Text>
                  <View style={styles.metricValue}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
                    <Text style={styles.metricAmount}>{formatCurrency(penaltyAmount)}</Text>
                  </View>
                </View>

                {/* Loan Term */}
                <View style={[styles.metricItem, styles.termBg]}>
                  <Text style={styles.metricLabel}>Loan Term</Text>
                  <Text style={styles.metricAmount}>
                    {initialLoanData.totalInstallment}{" "}
                    {initialLoanData.totalInstallment === 1 ? loanMethod : `${loanMethod}s`}
                  </Text>
                </View>
              </View>
            </View>

            {/* Loans List Sidebar */}
            <View style={styles.loansListContainer}>
              <View style={styles.loansListHeader}>
                <Text style={styles.loansListHeaderText}>LOAN ID</Text>
                <Text style={styles.loansListHeaderText}>AMOUNT</Text>
              </View>
              <FlatList
                data={userLoanData}
                renderItem={renderLoanItem}
                keyExtractor={(item) => item.loanId}
                style={styles.loansList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsList}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tab Content */}
            <View style={styles.tabContent}>{renderTabContent()}</View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  customerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textTransform: "capitalize",
  },
  loanIdBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loanIdBadgeText: {
    color: "#065f46",
    fontSize: 14,
    fontWeight: "500",
  },
  mainContent: {
    flexDirection: "column",
    gap: 24,
    marginBottom: 24,
  },
  metricsCard: {
    backgroundColor: "#475569",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: (width - 80) / 2 - 8,
    borderRadius: 12,
    padding: 16,
  },
  loanAmountBg: {
    backgroundColor: "#f8fafc",
  },
  repaymentBg: {
    backgroundColor: "#dbeafe",
  },
  outstandingBg: {
    backgroundColor: "#fef3c7",
  },
  termBg: {
    backgroundColor: "#f3e8ff",
  },
  metricLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 8,
  },
  metricValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  rupeeSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 4,
  },
  metricAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  loansListContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  loansListHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loansListHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  loansList: {
    maxHeight: 300,
  },
  loanItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  selectedLoanItem: {
    backgroundColor: "#dbeafe",
    borderLeftColor: "#3b82f6",
  },
  loanId: {
    flex: 1,
    fontWeight: "500",
    color: "#111827",
  },
  amountContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    fontWeight: "500",
    color: "#111827",
  },
  tabsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  tabsList: {
    backgroundColor: "#475569",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#64748b",
    borderRadius: 6,
    marginVertical: 4,
  },
  tabText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
})

export default LoanDetailsScreen
