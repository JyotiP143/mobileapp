"use client"

import { deleteInvestment, invest_Withdraw } from "@/axios/investWithdraw"
import { useInvestment } from "@/context/InvestmentContext"
import { useUser } from "@/context/UserContext"
import type {
  ApiResponse,
  EditFormData,
  FormData,
  Investment,
  InvestmentData,
  LoanData,
  Withdrawal
} from "@/types/withdrow"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type React from "react"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

const WithdrawalApp: React.FC = () => {
  const initialData: FormData = { amount: "", remark: "", date: "" }
  const editInitialData: EditFormData = { wid: "", amount: "", remark: "", date: "", email: "" }

  const [formData, setFormData] = useState<FormData>(initialData)
  const [editFormData, setEditFormData] = useState<EditFormData>(editInitialData)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [showEntriesModal, setShowEntriesModal] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const { setInvestmentData, investmentData, loading } = useInvestment()
  const { loanData } = useUser()

  let investments: Withdrawal[] = []
  let loanInvestments: Investment[] = []

  if (!loading && investmentData) {
    investments = investmentData.withdrawals || []
    loanInvestments = investmentData.investments || []
  }

  // Financial calculations
  const totalWithdraws = investments?.reduce((total: number, loan: Withdrawal) => total + Number(loan.amount), 0) || 0
  const totalInvest = loanInvestments?.reduce((total: number, loan: Investment) => total + Number(loan.amount), 0) || 0
  const totalProcessingFee =
   (loanData as LoanData[])?.reduce(
    (total, item) => total + parseInt(item.processingFee, 10),
    0
  ) || 0;

 const totalInterest =
  (loanData as LoanData[])?.reduce((total: number, item) => {
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
    }, 0) || 0

  const totalPaidAmount =
    (loanData as LoanData[])
      ?.flatMap((loan: LoanData) => loan.emiHistory)
      .reduce((total: number, item) => {
        return item.paidStatus === "Paid" ? total + Number.parseInt(item.amount, 10) : total
      }, 0) || 0

  const totalPaidPenalty =
   (loanData as LoanData[])
      ?.flatMap((loan: LoanData) => loan.emiHistory)
      .reduce((total: number, item) => {
        return item.paidStatus === "Paid" ? total + Number.parseInt(item.penaltyAmount, 10) : total
      }, 0) || 0

  const totalUserLoan =
  (loanData as LoanData[])?.reduce((total: number, item: LoanData) => total + Number.parseInt(item.loanAmount, 10), 0) || 0
  const totalCapitalAmt =
    totalPaidPenalty +
    totalInvest -
    totalUserLoan -
    totalWithdraws +
    totalProcessingFee +
    totalInterest +
    totalPaidAmount

  const filteredWithdrawals =
    investments?.filter((withdrawal: Withdrawal) => {
      const matchesSearch = withdrawal.remark.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    }) || []

  useEffect(() => {
    setTotalPages(Math.ceil(filteredWithdrawals.length / entriesPerPage))
  }, [filteredWithdrawals, entriesPerPage])

  const getCurrentPageItems = (): Withdrawal[] => {
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    return filteredWithdrawals.slice(startIndex, endIndex)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("en-GB", { month: "short" })
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const handleChange = (name: keyof FormData, value: string): void => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true)

    if (!formData.amount || !formData.date) {
      Alert.alert("Error", "Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (totalCapitalAmt < Number(formData.amount)) {
      setIsSubmitting(false)
      Alert.alert("Insufficient Funds", "You don't have sufficient amount to withdraw!")
      return
    }

    const email = investmentData.email
    const requestData = {
      email,
      withdrawal: { ...formData },
    }

    try {
      const response: ApiResponse = await invest_Withdraw(requestData) as any
      if (response.success) {
        setIsSubmitting(false)
        setIsModalOpen(false)
        setFormData(initialData)
        setInvestmentData((prevData: InvestmentData) => {
          const updatedWithdrawals = [...prevData.withdrawals, formData as Withdrawal]
          return {
            ...prevData,
            withdrawals: updatedWithdrawals,
          }
        })
        Alert.alert("Success", "Withdrawal completed successfully!")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process withdrawal")
      setIsSubmitting(false)
    }
  }

  const downloadPDF = (): void => {
    const doc = new jsPDF()
    doc.text("Withdrawal Records", 14, 10)
    const tableColumn = ["Date", "Amount", "Remarks"]
    const tableRows: string[][] = []

    getCurrentPageItems().forEach((withdrawal: Withdrawal) => {
      const rowData = [formatDate(withdrawal.date), `₹ ${withdrawal.amount}`, withdrawal.remark || "-"]
      tableRows.push(rowData)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save("withdrawal-records.pdf")
  }

  const editHandleChange = (name: keyof EditFormData, value: string): void => {
    setEditFormData({ ...editFormData, [name]: value })
  }

  const editHandleSubmit = async (): Promise<void> => {
    setIsSubmitting(true)

    if (!editFormData.amount || !editFormData.date) {
      Alert.alert("Error", "Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (totalCapitalAmt < Number(editFormData.amount)) {
      setIsSubmitting(false)
      Alert.alert("Insufficient Funds", "You don't have sufficient amount to withdraw!")
      return
    }

    const email = investmentData.email
    const requestData = {
      email,
      withdrawal: { ...editFormData },
    }

    try {
      const response: ApiResponse = await invest_Withdraw(requestData) as any
      if (response.success) {
        setInvestmentData((prevData: InvestmentData) => {
          const updatedWithdrawals = prevData.withdrawals.some((wd: Withdrawal) => wd._id === editFormData.wid)
  ? prevData.withdrawals.map((wd: Withdrawal) =>
      wd._id === editFormData.wid
        ? { ...wd, ...editFormData, _id: editFormData.wid } // 🛠 Include _id explicitly
        : wd,
    )
  : [...prevData.withdrawals, { ...editFormData, _id: editFormData.wid } as Withdrawal];

        })
        setIsEditModalOpen(false)
        setIsSubmitting(false)
        Alert.alert("Success", "Withdrawal updated successfully!")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update withdrawal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectAll = (): void => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(investments.map((row: Withdrawal) => row._id))
    }
    setSelectAll(!selectAll)
  }

  const handleRowSelect = (id: string): void => {
    let updatedSelection: string[] = []
    if (selectedRows.includes(id)) {
      updatedSelection = selectedRows.filter((rowId: string) => rowId !== id)
    } else {
      updatedSelection = [...selectedRows, id]
    }
    setSelectedRows(updatedSelection)
    setSelectAll(updatedSelection.length === investments.length)
  }

  const handleDelete = async (): Promise<void> => {
    Alert.alert("Confirm Delete", `Are you sure you want to delete ${selectedRows.length} withdrawal(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true)
          try {
            const response: ApiResponse = await deleteInvestment({
              ids: selectedRows,
              email: investmentData.email,
            }) as any
            if (response.success) {
              setInvestmentData((prevData: InvestmentData) => ({
                ...prevData,
                withdrawals: prevData.withdrawals.filter(
                  (withdrawal: Withdrawal) => !selectedRows.includes(withdrawal._id),
                ),
              }))
              setSelectedRows([])
              setSelectAll(false)
              Alert.alert("Success", response.message)
            } else {
              Alert.alert("Error", response.message)
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete withdrawals")
          } finally {
            setIsDeleting(false)
          }
        },
      },
    ])
  }

  const onRefresh = (): void => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const WithdrawalCard: React.FC<{ withdrawal: Withdrawal; index: number }> = ({ withdrawal, index }) => (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["rgba(97, 68, 239, 0.1)", "rgba(38, 74, 220, 0.1)"]} style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity style={styles.checkbox} onPress={() => handleRowSelect(withdrawal._id)}>
            <MaterialIcons
              name={selectedRows.includes(withdrawal._id) ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={selectedRows.includes(withdrawal._id) ? "#6a24c0ff" : "#9ca3af"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setIsEditModalOpen(true)
              setEditFormData({
                ...editFormData,
                wid: withdrawal._id,
                amount: withdrawal.amount,
                remark: withdrawal.remark,
                date: withdrawal.date,
              })
            }}
          >
            <MaterialIcons name="edit" size={20} color="#6644efff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="event" size={20} color="#6366f1" />
              <Text style={styles.fieldLabel}>Date</Text>
            </View>
            <Text style={styles.fieldValue}>{formatDate(withdrawal.date)}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="trending-down" size={20} color="#ef4444" />
              <Text style={styles.fieldLabel}>Amount</Text>
            </View>
            <Text style={[styles.fieldValue, styles.amountText]}>₹ {withdrawal.amount}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="note" size={20} color="#f59e0b" />
              <Text style={styles.fieldLabel}>Remarks</Text>
            </View>
            <Text style={styles.fieldValue} numberOfLines={2}>
              {withdrawal.remark || "No remarks"}
            </Text>
          </View>
        </View>

        
      </LinearGradient>
    </View>
  )

  const LoadingCard: React.FC = () => (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["rgba(107, 114, 128, 0.1)", "rgba(75, 85, 99, 0.1)"]} style={styles.card}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    </View>
  )
  const EntriesModal: React.FC = () => (
    <Modal
      visible={showEntriesModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEntriesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient colors={["#1e293b", "#334155"]} style={styles.entriesModalContent}>
          <Text style={styles.entriesTitle}>Entries per page</Text>
          {[25, 50, 100].map((entries) => (
            <TouchableOpacity
              key={entries}
              style={[styles.entriesOption, entriesPerPage === entries && styles.entriesOptionActive]}
              onPress={() => {
                setEntriesPerPage(entries)
                setCurrentPage(1)
                setShowEntriesModal(false)
              }}
            >
              <Text style={[styles.entriesOptionText, entriesPerPage === entries && styles.entriesOptionTextActive]}>
                {entries}
              </Text>
              {entriesPerPage === entries && <MaterialIcons name="check" size={20} color="#10b981" />}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.entriesCloseButton} onPress={() => setShowEntriesModal(false)}>
            <Text style={styles.entriesCloseText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  )

  const AddWithdrawalModal: React.FC = () => (
    <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={() => setIsModalOpen(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Withdrawal</Text>
            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            <View style={styles.availableBalance}>
              <Text style={styles.availableBalanceLabel}>Available Balance</Text>
              <Text style={styles.availableBalanceAmount}>₹ {totalCapitalAmt.toLocaleString()}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter withdrawal amount"
                value={formData.amount}
                onChangeText={(value) => handleChange("amount", value)}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Remarks</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Optional remarks"
                value={formData.remark}
                onChangeText={(value) => handleChange("remark", value)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                 placeholder="dd/mm/yyyy"
                value={formData.date}
                onChangeText={(value) => handleChange("date", value)}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Withdrawal</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const EditWithdrawalModal: React.FC = () => (
    <Modal visible={isEditModalOpen} transparent animationType="slide" onRequestClose={() => setIsEditModalOpen(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Withdrawal</Text>
            <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            <View style={styles.availableBalance}>
              <Text style={styles.availableBalanceLabel}>Available Balance</Text>
              <Text style={styles.availableBalanceAmount}>₹ {totalCapitalAmt.toLocaleString()}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter withdrawal amount"
                value={editFormData.amount}
                onChangeText={(value) => editHandleChange("amount", value)}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Remarks</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Optional remarks"
                value={editFormData.remark}
                onChangeText={(value) => editHandleChange("remark", value)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="dd/mm/yyyy"
                value={editFormData.date}
                onChangeText={(value) => editHandleChange("date", value)}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={editHandleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Update Withdrawal</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a0f0fff" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={["#5244efff", "#262fdcff"]} style={styles.headerIcon}>
              <MaterialIcons name="trending-down" size={24} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.headerTitle}>Withdrawals</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
            <MaterialIcons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

      

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search withdrawals..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <View style={styles.actionLeft}>
            <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
              <MaterialIcons name={selectAll ? "check-box" : "check-box-outline-blank"} size={20} color="#4f44efff" />
              <Text style={styles.selectAllText}>All</Text>
            </TouchableOpacity>
            {selectedRows.length > 0 && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <MaterialIcons name="delete" size={18} color="#ef4444" />
                <Text style={styles.deleteButtonText}>({selectedRows.length})</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.actionRight}>
            <TouchableOpacity style={styles.entriesButton} onPress={() => setShowEntriesModal(true)}>
              <Text style={styles.entriesButtonText}>{entriesPerPage}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.totalText}>{filteredWithdrawals.length}</Text>
          
          </View>
        </View>

        {/* Withdrawal List */}
        <ScrollView
          style={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <LoadingCard key={index} />)
            : getCurrentPageItems().map((withdrawal, index) => (
                <WithdrawalCard key={withdrawal._id} withdrawal={withdrawal} index={index} />
              ))}

          {!loading && filteredWithdrawals.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="money-off" size={64} color="#6b7280" />
              <Text style={styles.emptyStateText}>No withdrawals found</Text>
              <Text style={styles.emptyStateSubtext}>Your withdrawal history will appear here</Text>
            </View>
          )}
        </ScrollView>

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <MaterialIcons name="chevron-left" size={20} color="#ffffff" />
            </TouchableOpacity>

            <Text style={styles.paginationText}>
              {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Modals */}
        <AddWithdrawalModal />
        <EditWithdrawalModal />
        <EntriesModal />

        {/* Loading Overlay */}
        {isDeleting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingOverlayText}>Deleting...</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8dd23dff",
  },
  background: {
    height: 100,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  addButton: {
    backgroundColor: "#262fdcff",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectAllText: {
    color: "#445befff",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  entriesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  entriesButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  totalText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
 
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    padding: 4,
  },
  editButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    gap: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  fieldLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  fieldValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  amountText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
  withdrawalIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  withdrawalText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 16,
  },
  emptyStateText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  paginationButton: {
    backgroundColor: "rgba(239, 68, 68, 0.8)",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "rgba(107, 114, 128, 0.5)",
  },
  paginationText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  modalForm: {
    padding: 20,
    maxHeight: height * 10.10,
  },
  availableBalance: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  availableBalanceLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  availableBalanceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#0f40dfff",
    margin: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  entriesModalContent: {
    borderRadius: 16,
    padding: 24,
    width: width * 0.7,
    maxWidth: 250,
  },
  entriesTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  entriesOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  entriesOptionActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  entriesOptionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  entriesOptionTextActive: {
    color: "#10b981",
  },
  entriesCloseButton: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  entriesCloseText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingOverlayText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default WithdrawalApp
