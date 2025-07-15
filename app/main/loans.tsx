"use client"

import { Pagination } from "@/components/pagination"
import type React from "react"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "../../components/header"
import { SearchAndControls } from "../../components/searchandcontrols"
import type { Loan } from "../../types/index"
const mockLoans: Loan[] = [
  {
    id: "1",
    name: "Prashant",
    customerId: "CUST-1001",
    loanId: "LN-1001",
    loanAmount: 6000,
    installments: 6,
    nextPayment: "11 May 2025",
    status: "Active",
    phone: "7624821788",
  },
  {
    id: "2",
    name: "Prashant",
    customerId: "CUST-1001",
    loanId: "LN-1002",
    loanAmount: 4000,
    installments: 3,
    nextPayment: "25 Jun 2025",
    status: "Active",
    phone: "7624821788",
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    customerId: "CUST-1002",
    loanId: "LN-1003",
    loanAmount: 8500,
    installments: 12,
    nextPayment: "15 May 2025",
    status: "Overdue",
    phone: "9876543210",
  },
  {
    id: "4",
    name: "Anita Sharma",
    customerId: "CUST-1003",
    loanId: "LN-1004",
    loanAmount: 12000,
    installments: 8,
    nextPayment: "20 May 2025",
    status: "Active",
    phone: "8765432109",
  },
  
]

const LoansScreen = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("All")
  const entriesPerPage = 10

  const handleAddLoan = () => {
    console.log("Add Loan pressed")
  }

  const handleExport = () => {
    console.log("Export pressed")
  }

  const handleFilterPress = () => {
    console.log("Filter pressed")
  }

  const handlePayPress = (loanId: string) => {
    console.log("Pay pressed for loan:", loanId)
  }

  const handleCardPress = (loan: Loan) => {
    console.log("Card pressed for loan:", loan.loanId)
  }

  const filteredLoans = mockLoans.filter(
    (loan) =>
      loan.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      loan.loanId.toLowerCase().includes(searchValue.toLowerCase()) ||
      loan.customerId.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredLoans.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + entriesPerPage)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#10B981"
      case "overdue":
        return "#EF4444"
      case "completed":
        return "#6B7280"
      default:
        return "#F59E0B"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#ECFDF5"
      case "overdue":
        return "#FEF2F2"
      case "completed":
        return "#F9FAFB"
      default:
        return "#FFFBEB"
    }
  }

  const calculateNextPaymentAmount = (loanAmount: number, installments: number) => {
    return Math.round(loanAmount / installments)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Loans" icon="card" buttonText="Add Loan" onButtonPress={handleAddLoan} />

      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilter={true}
        filterText={filterStatus}
        onFilterPress={handleFilterPress}
        total={filteredLoans.length}
        onExport={handleExport}
      />
<ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {paginatedLoans.map((loan) => (
          <TouchableOpacity
            key={loan.id}
            style={styles.loanCard}
            onPress={() => handleCardPress(loan)}
            activeOpacity={0.7}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{loan.name}</Text>
                <Text style={styles.customerId}>ID: {loan.customerId}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(loan.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(loan.status) }]}>{loan.status}</Text>
              </View>
            </View>

            {/* Loan Amount Section */}
            <View style={styles.amountSection}>
              <View style={styles.loanAmountContainer}>
                <Text style={styles.amountLabel}>Loan Amount</Text>
                <Text style={styles.loanAmount}>₹{loan.loanAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.loanIdContainer}>
                <Text style={styles.loanIdLabel}>Loan ID</Text>
                <Text style={styles.loanId}>{loan.loanId}</Text>
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.paymentSection}>
              <View style={styles.nextPaymentContainer}>
                <Text style={styles.nextPaymentLabel}>Next Payment</Text>
                <Text style={styles.nextPaymentAmount}>
                  ₹{calculateNextPaymentAmount(loan.loanAmount, loan.installments).toLocaleString()}
                </Text>
                <Text style={styles.nextPaymentDate}>{loan.nextPayment}</Text>
              </View>
              <View style={styles.installmentsContainer}>
                <Text style={styles.installmentsLabel}>Installments</Text>
                <View style={styles.installmentsBadge}>
                  <Text style={styles.installmentsCount}>{loan.installments}</Text>
                </View>
              </View>
            </View>

            {/* Contact & Actions */}
            <View style={styles.cardFooter}>
              <View style={styles.contactInfo}>
                <Text style={styles.phoneIcon}>📞</Text>
                <Text style={styles.phoneNumber}>{loan.phone}</Text>
              </View>
              <TouchableOpacity style={styles.payButton} onPress={() => handlePayPress(loan.loanId)}>
                <Text style={styles.payButtonIcon}>💳</Text>
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(loan.installments / 12) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{loan.installments} of 12 installments</Text>
            </View>
          </TouchableOpacity>
        ))}

        {paginatedLoans.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💳</Text>
            <Text style={styles.emptyStateTitle}>No loans found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your search or filter criteria</Text>
          </View>
        )}
      </ScrollView>
      

<View style={styles.pagination}>

  <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredLoans.length}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
      />
</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContent: {
    paddingBottom: 20,
  },
  loanCard: {
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
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 4,
  },
  customerId: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  amountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  loanAmountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3B82F6",
  },
  loanIdContainer: {
    alignItems: "flex-end",
  },
  loanIdLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  loanId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  paymentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nextPaymentContainer: {
    flex: 1,
  },
  nextPaymentLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  nextPaymentAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 2,
  },
  nextPaymentDate: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  installmentsContainer: {
    alignItems: "center",
  },
  installmentsLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  installmentsBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: "center",
  },
  installmentsCount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  payButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#334155",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
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
  pagination:{
  flexDirection:"column",
  justifyContent:"space-between", 

  }
})

export default LoansScreen;