"use client"
import { Pagination } from "@/components/pagination"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { addLoanDetails, deleteLoans, loadLoanData, skipedEmi, updateEmi, updateUserLoan } from "../../axios/loanApi"
import { Header } from "../../components/header"
import { LoadingSpinner } from "../../components/loanErrormsg/loadingSpinner"
import { SearchAndControls } from "../../components/searchandcontrols"
import type { Loan } from "../../types/index"

const LoansScreen = () => {
  const [loans, setLoans] = useState()
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null)

  const entriesPerPage = 10

  // Mock data fallback when API fails or returns no data
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

  // Load loans data
  const fetchLoans = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      setError(null)

      // Replace 'user-id' with actual user ID from your auth context
      const response = await loadLoanData("user-id")

      if (response && Array.isArray(response)) {
        setLoans(response)
      } else if (response && response.loans && Array.isArray(response.loans)) {
        setLoans(response.loans)
      } else {
        // Use mock data if API doesn't return proper data
        console.log("Using mock data - API response:", response)
        setLoans(mockLoans)
      }
    } catch (err) {
      console.error("Error fetching loans:", err)
      // Use mock data on error
      setLoans(mockLoans)
      setError("Using offline data. Please check your connection.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchLoans(false)
  }, [fetchLoans])

  const handleAddLoan = () => {
    // Example of how to use addLoanDetails
    const newLoanInfo = {
      name: "New Customer",
      customerId: "CUST-NEW",
      loanAmount: 10000,
      installments: 12,
      phone: "1234567890",
      // Add other required fields
    }

    Alert.alert("Add Loan", "Navigate to add loan form or call addLoanDetails API", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Add Sample Loan",
        onPress: async () => {
          try {
            const response = await addLoanDetails(newLoanInfo)
            console.log("Add loan response:", response)
            if (response) {
              Alert.alert("Success", "Loan added successfully!")
              fetchLoans(false) // Refresh data
            }
          } catch (error) {
            console.error("Add loan error:", error)
            Alert.alert("Error", "Failed to add loan. Please try again.")
          }
        },
      },
    ])
  }

  const handleExport = () => {
    console.log("Export loans data")
    Alert.alert("Export", "Export functionality will be implemented here")
  }

  const handleFilterPress = () => {
    const statusOptions = ["All", "Active", "Overdue", "Completed"]
    Alert.alert(
      "Filter by Status",
      "Choose status to filter:",
      statusOptions.map((status) => ({
        text: status,
        onPress: () => setFilterStatus(status),
      })),
    )
  }

  const handlePayPress = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId)

      Alert.alert("Process Payment", "Choose payment action:", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setProcessingLoanId(null),
        },
        {
          text: "Pay EMI",
          onPress: async () => {
            try {
              const emiData = {
                loanId,
                paymentDate: new Date().toISOString(),
                amount: calculateNextPaymentAmount(
                  loans.find((l) => l.loanId === loanId)?.loanAmount || 0,
                  loans.find((l) => l.loanId === loanId)?.installments || 1,
                ),
                // Add other required fields
              }

              const response = await updateEmi(emiData)
              console.log("Update EMI response:", response)

              if (response) {
                Alert.alert("Success", "EMI payment processed successfully!")
                fetchLoans(false) // Refresh data
              } else {
                Alert.alert("Error", "Failed to process payment. Please try again.")
              }
            } catch (error) {
              console.error("Payment error:", error)
              Alert.alert("Error", "Payment processing failed. Please try again.")
            } finally {
              setProcessingLoanId(null)
            }
          },
        },
        {
          text: "Skip EMI",
          style: "destructive",
          onPress: async () => {
            try {
              const emiData = {
                loanId,
                skipDate: new Date().toISOString(),
                reason: "User requested skip",
                // Add other required fields
              }

              const response = await skipedEmi(emiData)
              console.log("Skip EMI response:", response)

              if (response) {
                Alert.alert("Success", "EMI skipped successfully!")
                fetchLoans(false) // Refresh data
              } else {
                Alert.alert("Error", "Failed to skip EMI. Please try again.")
              }
            } catch (error) {
              console.error("Skip EMI error:", error)
              Alert.alert("Error", "Failed to skip EMI. Please try again.")
            } finally {
              setProcessingLoanId(null)
            }
          },
        },
      ])
    } catch (error) {
      console.error("Error in handlePayPress:", error)
      setProcessingLoanId(null)
    }
  }

  const handleCardPress = (loan: Loan) => {
    // Navigate to loan details screen or show loan details
    Alert.alert(
      "Loan Details",
      `Loan ID: ${loan.loanId}\nCustomer: ${loan.name}\nAmount: ₹${loan.loanAmount.toLocaleString()}`,
      [
        {
          text: "Close",
          style: "cancel",
        },
        {
          text: "Edit Loan",
          onPress: async () => {
            try {
              const updatedLoanData = {
                loanId: loan.loanId,
                // Add fields you want to update
                lastModified: new Date().toISOString(),
              }

              const response = await updateUserLoan(updatedLoanData)
              console.log("Update loan response:", response)

              if (response) {
                Alert.alert("Success", "Loan updated successfully!")
                fetchLoans(false) // Refresh data
              }
            } catch (error) {
              console.error("Update loan error:", error)
              Alert.alert("Error", "Failed to update loan. Please try again.")
            }
          },
        },
      ],
    )
  }

  const handleDeleteLoan = async (loanId: string) => {
    Alert.alert("Delete Loan", "Are you sure you want to delete this loan? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessingLoanId(loanId)

            const response = await deleteLoans([loanId])
            console.log("Delete loan response:", response)

            if (response) {
              Alert.alert("Success", "Loan deleted successfully!")
              fetchLoans(false) // Refresh data
            } else {
              Alert.alert("Error", "Failed to delete loan. Please try again.")
            }
          } catch (error) {
            console.error("Delete error:", error)
            Alert.alert("Error", "Failed to delete loan. Please try again.")
          } finally {
            setProcessingLoanId(null)
          }
        },
      },
    ])
  }

  // Filter loans based on search and status
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      loan.loanId.toLowerCase().includes(searchValue.toLowerCase()) ||
      loan.customerId.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus = filterStatus === "All" || loan.status === filterStatus

    return matchesSearch && matchesStatus
  })

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

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Loans" icon="card" buttonText="Add Loan" onButtonPress={handleAddLoan} />
        <LoadingSpinner />
      </SafeAreaView>
    )
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

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" colors={["#3B82F6"]} />
        }
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
              <View style={styles.headerActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(loan.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(loan.status) }]}>{loan.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLoan(loan.loanId)}
                  disabled={processingLoanId === loan.loanId}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
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
              <TouchableOpacity
                style={[styles.payButton, processingLoanId === loan.loanId && styles.payButtonDisabled]}
                onPress={() => handlePayPress(loan.loanId)}
                disabled={processingLoanId === loan.loanId}
              >
                {processingLoanId === loan.loanId ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.payButtonIcon}>💳</Text>
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </>
                )}
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

        {paginatedLoans.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💳</Text>
            <Text style={styles.emptyStateTitle}>No loans found</Text>
            <Text style={styles.emptyStateText}>
              {searchValue || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first loan"}
            </Text>
            {!searchValue && filterStatus === "All" && (
              <TouchableOpacity style={styles.addLoanButton} onPress={handleAddLoan}>
                <Text style={styles.addLoanButtonText}>Add Your First Loan</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredLoans.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  deleteButtonText: {
    fontSize: 16,
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
    minWidth: 100,
    justifyContent: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#6B7280",
    shadowOpacity: 0,
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
    marginBottom: 20,
  },
  addLoanButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addLoanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1E293B",
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
})

export default LoansScreen
