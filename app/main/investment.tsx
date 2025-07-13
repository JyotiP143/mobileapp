"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "../../components/header"
import { Pagination } from "../../components/pagination"
import { SearchAndControls } from "../../components/searchandcontrols"
import type { Investment } from "../../types/index"

const mockInvestments: Investment[] = [
  {
    id: "1",
    date: "25-Mar-2025",
    amount: 100000,
    remarks: "Initial capital investment for business expansion",
  },
  {
    id: "2",
    date: "15-Feb-2025",
    amount: 75000,
    remarks: "Equipment purchase and setup costs",
  },
  {
    id: "3",
    date: "10-Jan-2025",
    amount: 50000,
    remarks: "Marketing and promotional activities",
  },
  {
    id: "4",
    date: "28-Dec-2024",
    amount: 125000,
    remarks: "Office renovation and infrastructure upgrade",
  },
  {
    id: "5",
    date: "20-Nov-2024",
    amount: 30000,
    remarks: "Technology and software licensing",
  },
  {
    id: "6",
    date: "05-Oct-2024",
    amount: 85000,
    remarks: "Inventory and stock management system",
  },
]

export const InvestmentScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  const handleAddInvestment = () => {
    console.log("Add Investment pressed")
  }

  const handleExport = () => {
    console.log("Export pressed")
  }

  const handleInvestmentPress = (investment: Investment) => {
    console.log("Investment card pressed:", investment.id)
  }

  const handleEditPress = (investmentId: string) => {
    console.log("Edit investment:", investmentId)
  }

  const filteredInvestments = mockInvestments.filter(
    (investment) =>
      investment.remarks.toLowerCase().includes(searchValue.toLowerCase()) ||
      investment.date.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredInvestments.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedInvestments = filteredInvestments.slice(startIndex, startIndex + entriesPerPage)

  const getInvestmentCategory = (amount: number) => {
    if (amount >= 100000) return { category: "Major", color: "#8B5CF6", bgColor: "#F3E8FF" }
    if (amount >= 50000) return { category: "Significant", color: "#3B82F6", bgColor: "#EBF8FF" }
    return { category: "Standard", color: "#10B981", bgColor: "#ECFDF5" }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(/-/g, "/"))
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getTotalInvestment = () => {
    return filteredInvestments.reduce((total, investment) => total + investment.amount, 0)
  }

  const getAverageInvestment = () => {
    return filteredInvestments.length > 0 ? getTotalInvestment() / filteredInvestments.length : 0
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Investment" icon="trending-up" buttonText="Investment" onButtonPress={handleAddInvestment} />

      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        total={filteredInvestments.length}
        onExport={handleExport}
      />

      <ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {paginatedInvestments.map((investment) => {
          const categoryInfo = getInvestmentCategory(investment.amount)
          return (
            <TouchableOpacity
              key={investment.id}
              style={styles.investmentCard}
              onPress={() => handleInvestmentPress(investment)}
              activeOpacity={0.7}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <View>
                    <Text style={styles.investmentDate}>{investment.date}</Text>
                    <Text style={styles.relativeDate}>{formatDate(investment.date)}</Text>
                  </View>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.bgColor }]}>
                  <Text style={[styles.categoryText, { color: categoryInfo.color }]}>{categoryInfo.category}</Text>
                </View>
              </View>

              {/* Amount Section */}
              <View style={styles.amountSection}>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Investment Amount</Text>
                  <Text style={styles.investmentAmount}>₹{investment.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.amountVisualization}>
                  <View style={styles.amountBar}>
                    <View
                      style={[
                        styles.amountFill,
                        {
                          width: `${Math.min((investment.amount / 150000) * 100, 100)}%`,
                          backgroundColor: categoryInfo.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>  
            </TouchableOpacity>
          )
        })}

     
      </ScrollView>

    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredInvestments.length}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
      /> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  summaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#334155",
    marginHorizontal: 16,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContent: {
    paddingBottom: 20,
  },
  investmentCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  investmentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 2,
  },
  relativeDate: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  amountSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  investmentAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10B981",
  },
  amountVisualization: {
    marginTop: 8,
  },
  amountBar: {
    height: 6,
    backgroundColor: "#334155",
    borderRadius: 3,
  },
  amountFill: {
    height: "100%",
    borderRadius: 3,
  },
  remarksSection: {
    marginBottom: 16,
  },
  remarksLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  remarksText: {
    fontSize: 14,
    color: "#F8FAFC",
    lineHeight: 20,
    fontWeight: "500",
  },
  metricsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricIcon: {
    fontSize: 16,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 12,
    color: "#F8FAFC",
    fontWeight: "600",
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  investmentId: {
    flex: 1,
  },
  idLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  editIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  editText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
})
