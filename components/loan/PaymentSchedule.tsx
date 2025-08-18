"use client"

import { useUser } from "@/context/UserContext"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import type React from "react"
import { useState } from "react"
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

interface Props {
  loanData: any
}

export const PaymentSchedule: React.FC<Props> = ({ loanData }) => {
  const { fetchLoanData } = useUser()
  const [isPayloanOpen, setIsPayloanOpen] = useState(false)
  const [isEmiOpen, setIsEmiOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    loanId: loanData ? loanData._id : "",
    emiID: "",
    date: new Date().toISOString().split("T")[0],
    loanAmount: "",
    penaltyAmount: "0",
    paidStatus: "Paid",
  })

  if (!loanData) return null

  const initialData = {
    loanId: loanData._id,
    emiID: "",
    date: new Date().toISOString().split("T")[0],
    loanAmount: "",
    penaltyAmount: "0",
    paidStatus: "Paid",
  }

  const modalData = (amount: string, date: string, id: string) => {
    if (date) {
      const givenDate = new Date(date)
      const today = new Date()
      const timeDifference = today.getTime() - givenDate.getTime()
      const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

      let penaltyAmount = 0

      if (loanData.repaymentMethod === "daily") {
        if (dayDifference > 1) {
          penaltyAmount = ((loanData.installmentAmount * 10) / 100) * (dayDifference - 1)
        }
      } else if (loanData.repaymentMethod === "weekly") {
        const weekDifference = Math.floor(dayDifference / 7)
        if (weekDifference >= 1) {
          penaltyAmount = ((loanData.installmentAmount * 10) / 100) * weekDifference
        }
      } else if (loanData.repaymentMethod === "monthly") {
        const monthDifference = Math.floor(dayDifference / 30)
        if (monthDifference >= 1) {
          penaltyAmount = ((loanData.installmentAmount * 10) / 100) * monthDifference
        }
      }

      let skipped = loanData.emiHistory.reduce(
        (total: number, emi: any) => total + Number(emi.skipedPenaltyAmount) - Number(emi.penaltyAmount),
        0,
      )
      skipped = skipped > 0 ? skipped : 0

      setFormData({
        ...initialData,
        loanAmount: amount,
        date: date,
        emiID: id,
        paidStatus: "Paid",
        penaltyAmount: skipped.toFixed(2),
      })

      setIsPayloanOpen(true)
    }
  }

  const handleFormChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert("Success", "Payment updated successfully")
      setIsPayloanOpen(false)
      // fetchLoanData(); // Uncomment when API is available
    } catch (error) {
      Alert.alert("Error", "Failed to update payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const editPayment = (emiData: any) => {
    setFormData({
      loanId: loanData._id,
      emiID: emiData._id,
      date: emiData.date,
      loanAmount: emiData.amount,
      penaltyAmount: emiData.penaltyAmount || "0",
      paidStatus: "Due",
    })
    setIsEmiOpen(true)
  }

  const skipPayment = async (emiData: any) => {
    Alert.alert("Skip Payment", "Are you sure you want to skip this payment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Skip",
        style: "destructive",
        onPress: async () => {
          try {
            // Mock API call - replace with actual implementation
            await new Promise((resolve) => setTimeout(resolve, 1000))
            Alert.alert("Success", "Payment skipped successfully")
            // fetchLoanData(); // Uncomment when API is available
          } catch (error) {
            Alert.alert("Error", "Failed to skip payment")
          }
        },
      },
    ])
  }

  const togglePaidStatus = () => {
    setFormData((prev) => ({
      ...prev,
      paidStatus: prev.paidStatus === "Paid" ? "Due" : "Paid",
    }))
  }

  const { emiHistory } = loanData
  const totalItems = emiHistory.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedData = emiHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const filteredData =
    statusFilter === "all"
      ? paginatedData
      : paginatedData.filter((row: any) => {
          const status = row.paidDate ? "Paid" : "Pending"
          return statusFilter === status.toLowerCase()
        })

  let beginningBalance = Number.parseFloat(loanData.loanAmount)
  let firstDueFound = false

  const renderScheduleItem = ({ item, index }: { item: any; index: number }) => {
    const installmentDate = new Date(item.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    const paidDate = item.paidDate
      ? new Date(item.paidDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "--"

    const closingBalance = beginningBalance - item.amount
    const isPayable = item.paidStatus === "Due" && !firstDueFound

    if (item.paidStatus === "Due") {
      firstDueFound = true
    }

    const result = (
      <View style={styles.scheduleItem}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.indexCell]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.dateCell]}>{installmentDate}</Text>
            <Text style={[styles.cell, styles.dateCell]}>{paidDate}</Text>
            <Text style={[styles.cell, styles.amountCell]}>₹{beginningBalance.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.amountCell]}>₹{item.amount}</Text>
            <View style={[styles.cell, styles.payCell]}>
              <Text style={styles.amountText}>₹{item.amount}</Text>
              {item.paidStatus === "Paid" || item.paidStatus === "Skipped" ? (
                <View style={[styles.statusBadge, item.paidStatus === "Paid" ? styles.paidBadge : styles.skippedBadge]}>
                  <Text style={styles.statusText}>{item.paidStatus}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.payButton, isPayable ? styles.payableButton : styles.disabledButton]}
                  onPress={isPayable ? () => modalData(item.amount, item.date, item._id) : undefined}
                  disabled={!isPayable}
                >
                  <Text style={styles.payButtonText}>Pay</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.cell, styles.amountCell]}>₹{item.skipedPenaltyAmount || "0.00"}</Text>
            <Text style={[styles.cell, styles.amountCell]}>₹{closingBalance.toFixed(2)}</Text>
            <View style={[styles.cell, styles.statusCell]}>
              {item.paidStatus === "Paid" || item.paidStatus === "Skipped" ? (
                <View style={styles.statusContainer}>
                  <Text style={[styles.statusText, item.paidStatus === "Paid" ? styles.paidText : styles.skippedText]}>
                    {item.paidStatus}
                  </Text>
                  <TouchableOpacity style={styles.editButton} onPress={() => editPayment(item)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.statusContainer}>
                  <Text style={styles.pendingText}>Pending</Text>
                  {isPayable && (
                    <TouchableOpacity style={styles.skipButton} onPress={() => skipPayment(item)}>
                      <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    )

    beginningBalance = closingBalance
    return result
  }

  return (
    <View style={styles.container}>
      {/* Header Controls */}
      <View style={styles.headerControls}>
        <View style={styles.controlRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={itemsPerPage.toString()}
              style={styles.picker}
              onValueChange={(value) => {
                setItemsPerPage(Number.parseInt(value))
                setCurrentPage(1)
              }}
            >
              <Picker.Item label="25" value="25" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="75" value="75" />
            </Picker>
          </View>
          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 1 && styles.disabledNavButton]}
            onPress={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.recordInfo}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} records
          </Text>
          <TouchableOpacity
            style={[styles.navButton, currentPage === totalPages && styles.disabledNavButton]}
            onPress={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusFilter}
              style={styles.picker}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <Picker.Item label="All" value="all" />
              <Picker.Item label="Paid" value="paid" />
              <Picker.Item label="Pending" value="pending" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.indexCell]}>#</Text>
          <Text style={[styles.headerCell, styles.dateCell]}>Installment Date</Text>
          <Text style={[styles.headerCell, styles.dateCell]}>Paid Date</Text>
          <Text style={[styles.headerCell, styles.amountCell]}>Balance</Text>
          <Text style={[styles.headerCell, styles.amountCell]}>Principal</Text>
          <Text style={[styles.headerCell, styles.payCell]}>Total Pay</Text>
          <Text style={[styles.headerCell, styles.amountCell]}>Penalty</Text>
          <Text style={[styles.headerCell, styles.amountCell]}>Closing Balance</Text>
          <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
        </View>
      </ScrollView>

      {/* Table Data */}
      <FlatList
        data={filteredData}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Payment Modal */}
      <Modal
        visible={isPayloanOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPayloanOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Installment</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsPayloanOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(value) => handleFormChange("date", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Installment Amount *</Text>
              <TextInput
                style={styles.input}
                value={formData.loanAmount}
                onChangeText={(value) => handleFormChange("loanAmount", value)}
                placeholder="Enter the amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Penalty Amount</Text>
              <TextInput
                style={styles.input}
                value={formData.penaltyAmount}
                onChangeText={(value) => handleFormChange("penaltyAmount", value)}
                placeholder="Enter the amount"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? "Submitting..." : "Submit"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit EMI Modal */}
      <Modal visible={isEmiOpen} transparent={true} animationType="slide" onRequestClose={() => setIsEmiOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Installment</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsEmiOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(value) => handleFormChange("date", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Installment Amount *</Text>
              <TextInput
                style={styles.input}
                value={formData.loanAmount}
                onChangeText={(value) => handleFormChange("loanAmount", value)}
                placeholder="Enter the amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Penalty Amount</Text>
              <TextInput
                style={styles.input}
                value={formData.penaltyAmount}
                onChangeText={(value) => handleFormChange("penaltyAmount", value)}
                placeholder="Enter the amount"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.toggleContainer} onPress={togglePaidStatus}>
              <Text style={styles.toggleLabel}>Mark as {formData.paidStatus === "Paid" ? "Unpaid" : "Paid"}</Text>
              <View
                style={[styles.toggle, formData.paidStatus === "Paid" ? styles.toggleActive : styles.toggleInactive]}
              >
                <View style={[styles.toggleThumb, formData.paidStatus === "Paid" && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? "Submitting..." : "Submit"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
  },
  headerControls: {
    marginBottom: 16,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  pickerContainer: {
    backgroundColor: "#475569",
    borderRadius: 6,
    minWidth: 100,
  },
  picker: {
    color: "#fff",
    height: 40,
  },
  pageInfo: {
    color: "#f1f5f9",
    fontSize: 14,
  },
  navButton: {
    backgroundColor: "#475569",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disabledNavButton: {
    backgroundColor: "#334155",
    opacity: 0.5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  recordInfo: {
    color: "#f1f5f9",
    fontSize: 12,
    textAlign: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  downloadButton: {
    backgroundColor: "#475569",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  scheduleItem: {
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: width * 2, // Make it scrollable horizontally
  },
  cell: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  indexCell: {
    width: 40,
  },
  dateCell: {
    width: 100,
  },
  amountCell: {
    width: 80,
  },
  payCell: {
    width: 120,
    alignItems: "center",
  },
  statusCell: {
    width: 100,
  },
  amountText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: "#dcfce7",
  },
  skippedBadge: {
    backgroundColor: "#fed7aa",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  payButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  payableButton: {
    backgroundColor: "#1e40af",
  },
  disabledButton: {
    backgroundColor: "#6b7280",
    opacity: 0.5,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 10,
  },
  statusContainer: {
    alignItems: "center",
  },
  paidText: {
    color: "#22c55e",
    fontSize: 12,
    marginBottom: 2,
  },
  skippedText: {
    color: "#f59e0b",
    fontSize: 12,
    marginBottom: 2,
  },
  pendingText: {
    color: "#f97316",
    fontSize: 12,
    marginBottom: 2,
  },
  editButton: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#92400e",
    fontSize: 10,
  },
  skipButton: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skipButtonText: {
    color: "#92400e",
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 14,
    color: "#374151",
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#22c55e",
  },
  toggleInactive: {
    backgroundColor: "#ef4444",
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
