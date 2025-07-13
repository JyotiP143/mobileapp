"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "../../components/header"
import { Pagination } from "../../components/pagination"
import { SearchAndControls } from "../../components/searchandcontrols"
import type { Withdrawal } from "../../types/index"

const mockWithdrawals: Withdrawal[] = [
  {
    id: "1",
    date: "22-Mar-2025",
    amount: 25000,
    remarks: "Emergency fund withdrawal for medical expenses",
  },
  {
    id: "2",
    date: "18-Mar-2025",
    amount: 15000,
    remarks: "Business operational costs and salary payments",
  },
  {
    id: "3",
    date: "10-Mar-2025",
    amount: 8500,
    remarks: "Equipment maintenance and repair costs",
  },
  {
    id: "4",
    date: "05-Mar-2025",
    amount: 12000,
    remarks: "Monthly office rent and utility payments",
  },
  {
    id: "5",
    date: "28-Feb-2025",
    amount: 35000,
    remarks: "Loan disbursement to approved member",
  },
  {
    id: "6",
    date: "20-Feb-2025",
    amount: 5500,
    remarks: "Administrative expenses and documentation",
  },
]

export const WithdrawnScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  const handleWithdraw = () => {
    console.log("Withdraw pressed")
  }

  const handleExport = () => {
    console.log("Export pressed")
  }

  const handleWithdrawalPress = (withdrawal: Withdrawal) => {
    console.log("Withdrawal card pressed:", withdrawal.id)
  }

  const handleViewDetails = (withdrawalId: string) => {
    console.log("View details for withdrawal:", withdrawalId)
  }

  const filteredWithdrawals = mockWithdrawals.filter(
    (withdrawal) =>
      withdrawal.remarks.toLowerCase().includes(searchValue.toLowerCase()) ||
      withdrawal.date.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredWithdrawals.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + entriesPerPage)

  const getWithdrawalCategory = (amount: number) => {
    if (amount >= 30000) return { category: "Large", color: "#EF4444", bgColor: "#FEF2F2", icon: "🔴" }
    if (amount >= 15000) return { category: "Medium", color: "#F59E0B", bgColor: "#FFFBEB", icon: "🟡" }
    return { category: "Small", color: "#10B981", bgColor: "#ECFDF5", icon: "🟢" }
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
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>💸</Text>
      </View>
      <Text style={styles.emptyTitle}>No withdrawals found</Text>
      <Text style={styles.emptyText}>Your withdrawal history will appear here once you make your first withdrawal</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleWithdraw}>
        <Text style={styles.emptyButtonText}>Make First Withdrawal</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Withdrawn" icon="arrow-down-circle" buttonText="Withdraw" onButtonPress={handleWithdraw} />

      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        total={filteredWithdrawals.length}
        onExport={handleExport}
      />

      <ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {paginatedWithdrawals.length === 0 ? (
          <EmptyState />
        ) : (
          paginatedWithdrawals.map((withdrawal) => {
            const categoryInfo = getWithdrawalCategory(withdrawal.amount)
            return (
              <TouchableOpacity
                key={withdrawal.id}
                style={styles.withdrawalCard}
                onPress={() => handleWithdrawalPress(withdrawal)}
                activeOpacity={0.7}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateIcon}>📅</Text>
                    <View>
                      <Text style={styles.withdrawalDate}>{withdrawal.date}</Text>
                      <Text style={styles.relativeDate}>{formatDate(withdrawal.date)}</Text>
                    </View>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.bgColor }]}>
                    <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                    <Text style={[styles.categoryText, { color: categoryInfo.color }]}>{categoryInfo.category}</Text>
                  </View>
                </View>

                {/* Amount Section */}
                <View style={styles.amountSection}>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Withdrawal Amount</Text>
                    <Text style={[styles.withdrawalAmount, { color: categoryInfo.color }]}>
                      -₹{withdrawal.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.amountVisualization}>
                    <View style={styles.amountBar}>
                      <View
                        style={[
                          styles.amountFill,
                          {
                            width: `${Math.min((withdrawal.amount / 50000) * 100, 100)}%`,
                            backgroundColor: categoryInfo.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)}
        totalEntries={filteredWithdrawals.length}
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
    flexGrow: 1,
  },
  withdrawalCard: {
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
  withdrawalDate: {
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 6,
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
  withdrawalAmount: {
    fontSize: 28,
    fontWeight: "800",
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
  purposeSection: {
    marginBottom: 16,
  },
  purposeLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  purposeText: {
    fontSize: 14,
    color: "#F8FAFC",
    lineHeight: 20,
    fontWeight: "500",
  },
  transactionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
  },
  transactionItem: {
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    fontSize: 16,
    marginBottom: 6,
  },
  transactionLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  transactionValue: {
    fontSize: 12,
    color: "#F8FAFC",
    fontWeight: "600",
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionId: {
    flex: 1,
  },
  idLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  detailsButton: {
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
  detailsIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailsText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  impactIndicator: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  impactText: {
    fontSize: 12,
    color: "#D1D5DB",
    fontWeight: "500",
    lineHeight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#374151",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
