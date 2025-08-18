"use client"

import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import type React from "react"
import { useState } from "react"
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface Props {
  loanData: any
  payLoanmethod: string
  setLoanData: (data: any) => void
}

export const GeneralInfo: React.FC<Props> = ({ loanData, payLoanmethod, setLoanData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...loanData })
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null)

  const totalPaidAmount = loanData.emiHistory.reduce((total: number, loan: any) => {
    if (loan.paidStatus === "Paid") {
      total += Number(loan.amount)
    }
    return total
  }, 0)

  const formatDate = (isoDateString: string) => {
    return new Date(isoDateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const handleChange = (name: string, value: string | number) => {
    setFormData((prevData: any) => {
      const updatedData = { ...prevData, [name]: value }

      if (name === "loanAmount" && prevData.totalInstallment) {
        const newInstallmentAmount =
          (Number(value) - Number(prevData.advancePayment)) / Number(prevData.totalInstallment)
        updatedData.installmentAmount = Number.parseFloat(newInstallmentAmount.toFixed(2))
      } else if (name === "totalInstallment" && prevData.loanAmount) {
        const newInstallmentAmount = (Number(prevData.loanAmount) - Number(prevData.advancePayment)) / Number(value)
        updatedData.installmentAmount = Number.parseFloat(newInstallmentAmount.toFixed(2))
      }

      // Update EMI history amounts if loanAmount or totalInstallment changes
      updatedData.emiHistory = updatedData.emiHistory.map((emi: any) => {
        if (emi.paidStatus === "Due") {
          emi.amount = updatedData.installmentAmount
        }
        return emi
      })

      const frequency = updatedData.repaymentMethod || "monthly"
      let lastEmiDate = updatedData.repaymentStartDate
        ? new Date(updatedData.repaymentStartDate)
        : updatedData.emiHistory.length > 0
          ? new Date(updatedData.emiHistory[updatedData.emiHistory.length - 1].date)
          : new Date()

      // Handle repaymentStartDate update
      if (name === "repaymentStartDate") {
        let advPayCount = 0
        updatedData.emiHistory = updatedData.emiHistory.map((emi: any, index: number) => {
          const emiDate = new Date(value as string)
          if (emi.transactionId === "AdvPay") {
            return emi
          }
          const prevEmi = updatedData.emiHistory[index - 1]

          if (index !== 0 && prevEmi?.transactionId === "AdvPay") {
            advPayCount = 1
            return { ...emi, date: new Date(value as string).toISOString() }
          }
          const adjustedIndex = index - advPayCount
          if (frequency === "daily") {
            emiDate.setDate(emiDate.getDate() + adjustedIndex)
          } else if (frequency === "weekly") {
            emiDate.setDate(emiDate.getDate() + adjustedIndex * 7)
          } else if (frequency === "monthly") {
            emiDate.setMonth(emiDate.getMonth() + adjustedIndex)
          }

          return { ...emi, date: emiDate.toISOString() }
        })
      }

      // Handle repaymentMethod change
      if (name === "repaymentMethod") {
        const newFrequency = value as string
        const repaymentStartDate = updatedData.repaymentStartDate || new Date().toISOString()
        let advPayCount = 0
        updatedData.emiHistory = updatedData.emiHistory.map((emi: any, index: number) => {
          const emiDate = new Date(repaymentStartDate)

          if (emi.transactionId === "AdvPay") {
            return emi
          }

          const prevEmi = updatedData.emiHistory[index - 1]

          if (index !== 0 && prevEmi?.transactionId === "AdvPay") {
            advPayCount = 1
            return { ...emi, date: new Date(repaymentStartDate).toISOString() }
          }
          const adjustedIndex = index - advPayCount
          if (newFrequency === "daily") {
            emiDate.setDate(emiDate.getDate() + adjustedIndex)
          } else if (newFrequency === "weekly") {
            emiDate.setDate(emiDate.getDate() + adjustedIndex * 7)
          } else if (newFrequency === "monthly") {
            emiDate.setMonth(emiDate.getMonth() + adjustedIndex)
          }

          return { ...emi, date: emiDate.toISOString() }
        })
      }

      // Add extra EMIs if needed
      if (updatedData.totalInstallment >= updatedData.emiHistory.length) {
        const startIndex = updatedData.emiHistory[0]?.transactionId === "AdvPay" ? 1 : 0
        const extraEmisNeeded = updatedData.totalInstallment - (updatedData.emiHistory.length - startIndex)

        for (let i = 0; i < extraEmisNeeded; i++) {
          const emiDate = new Date(lastEmiDate)

          if (frequency === "daily") {
            emiDate.setDate(emiDate.getDate() + 1)
          } else if (frequency === "weekly") {
            emiDate.setDate(emiDate.getDate() + 7)
          } else if (frequency === "monthly") {
            emiDate.setMonth(emiDate.getMonth() + 1)
          }

          updatedData.emiHistory.push({
            amount: updatedData.installmentAmount,
            date: emiDate.toISOString(),
            method: "--",
            paidDate: null,
            paidStatus: "Due",
            penaltyAmount: "0",
            transactionId: `TXN${(prevData.emiHistory.length + i + 1).toString().padStart(5, "0")}`,
          })

          lastEmiDate = emiDate
        }
      }

      return updatedData
    })
  }

  const handleSubmit = async () => {
    if (isEditing) {
      setLoanData((prevData: any[]) =>
        prevData.map((loan: any) => (loan.loanId === formData.loanId ? { ...loan, ...formData } : loan)),
      )
      try {
        // Replace with actual API call
        // const response = await updateUserLoan(formData);
        Alert.alert("Success", "Loan information updated successfully")
      } catch (error) {
        Alert.alert("Error", "Failed to update loan information")
      }
    }
    setIsEditing(!isEditing)
  }

  const formatRepaymentMethod = (method: string, totalInstallment: number) => {
    const mapping: { [key: string]: string } = {
      daily: "Day",
      weekly: "Week",
      monthly: "Month",
    }

    return totalInstallment === 1 ? mapping[method] : `${mapping[method]}s`
  }

  const handleDateChange = (event: any, selectedDate?: Date, fieldName?: string) => {
    setShowDatePicker(null)
    if (selectedDate && fieldName) {
      handleChange(fieldName, selectedDate.toISOString())
    }
  }

  const renderDatePicker = (fieldName: string, value: string) => {
    if (isEditing) {
      return (
        <View>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(fieldName)}>
            <Text style={styles.dateButtonText}>{formatDate(value)}</Text>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
          </TouchableOpacity>
          {showDatePicker === fieldName && (
            <DateTimePicker
              value={new Date(value)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => handleDateChange(event, date, fieldName)}
            />
          )}
        </View>
      )
    }
    return <Text style={styles.valueone}>{formatDate(value)}</Text>
  }

  const renderPicker = (name: string, value: string, options: { label: string; value: string }[]) => {
    if (isEditing) {
      return (
        <View style={styles.pickerContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.pickerOption, value === option.value && styles.pickerOptionSelected]}
              onPress={() => handleChange(name, option.value)}
            >
              <Text style={[styles.pickerOptionText, value === option.value && styles.pickerOptionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )
    }
    return <Text style={styles.valueone}>{options.find((opt) => opt.value === value)?.label || value}</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan Information</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleSubmit}>
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Loan Details Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total loan amount</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.loanAmount.toString()}
                  onChangeText={(text) => handleChange("loanAmount", Number(text))}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <Text style={styles.cardValue}>₹ {formData.loanAmount.toLocaleString("en-IN")}</Text>
              )}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Interest Rate</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.interest.toString()}
                  onChangeText={(text) => handleChange("interest", Number(text))}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <Text style={styles.cardValue}>{formData.interest}%</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Loan Term</Text>
              {isEditing ? (
                <View style={styles.loanTermContainer}>
                  <TextInput
                    style={[styles.input, styles.loanTermInput]}
                    value={formData.totalInstallment.toString()}
                    onChangeText={(text) => handleChange("totalInstallment", Number(text))}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  {renderPicker("repaymentMethod", formData.repaymentMethod, [
                    { label: "Days", value: "daily" },
                    { label: "Weeks", value: "weekly" },
                    { label: "Months", value: "monthly" },
                  ])}
                </View>
              ) : (
                <Text style={styles.cardValue}>
                  {formData.totalInstallment}{" "}
                  {formatRepaymentMethod(formData.repaymentMethod, formData.totalInstallment)}
                </Text>
              )}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Monthly EMI</Text>
              <Text style={styles.cardValue}>₹ {formData.installmentAmount}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={[styles.card, styles.paidCard]}>
              <Text style={styles.paidCardLabel}>Total Paid</Text>
              <Text style={styles.paidCardValue}>₹ {totalPaidAmount.toLocaleString("en-IN")}</Text>
            </View>
            <View style={[styles.card, styles.feeCard]}>
              <Text style={styles.feeCardLabel}>Processing Fee</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.feeInput]}
                  value={formData.processingFee.toString()}
                  onChangeText={(text) => handleChange("processingFee", Number(text))}
                  keyboardType="numeric"
                  placeholderTextColor="#6b7280"
                />
              ) : (
                <Text style={styles.feeCardValue}>₹ {formData.processingFee}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          {[
            {
              label: "Payment Method",
              icon: "card-outline",
              name: "paymentMethod",
              value: formData.paymentMethod,
            },
            {
              label: "Issue Date",
              icon: "calendar-outline",
              name: "approvalDate",
              value: formData.approvalDate,
              isDate: true,
            },
            {
              label: "Email",
              icon: "mail-outline",
              name: "email",
              value: formData.email,
            },
            {
              label: "Phone",
              icon: "call-outline",
              name: "phone",
              value: formData.phone,
            },
            ...(isEditing
              ? [
                  {
                    label: "Name",
                    icon: "person-outline",
                    name: "name",
                    value: formData.name,
                  },
                  {
                    label: "Repayment Start Date",
                    icon: "calendar-outline",
                    name: "repaymentStartDate",
                    value: formData.repaymentStartDate,
                    isDate: true,
                  },
                ]
              : []),
          ].map(({ label, icon, name, value, isDate }) => (
            <View key={name} style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name={icon as any} size={16} color="#d1d5db" />
                <Text style={styles.infoLabelText}>{label}</Text>
              </View>
              {isEditing ? (
                isDate ? (
                  renderDatePicker(name, value)
                ) : (
                  <TextInput
                    style={styles.infoInput}
                    value={value}
                    onChangeText={(text) => handleChange(name, text)}
                    placeholderTextColor="#9ca3af"
                  />
                )
              ) : (
                <Text style={styles.infoValue}>{isDate ? formatDate(value) : value}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4b5563",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: "bold",
  },
  loanTermContainer: {
    flexDirection: "row",
    gap: 8,
  },
  loanTermInput: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#4b5563",
    marginVertical: 16,
  },
  paidCard: {
    backgroundColor: "#ecfdf5",
  },
  paidCardLabel: {
    fontSize: 12,
    color: "#059669",
    marginBottom: 4,
  },
  paidCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#047857",
  },
  feeCard: {
    backgroundColor: "#eff6ff",
  },
  feeCardLabel: {
    fontSize: 12,
    color: "#2563eb",
    marginBottom: 4,
  },
valueone: {
    fontSize: 16,
    color: "#333",
  },
  feeCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  feeInput: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#d1d5db",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  infoInput: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    minWidth: 120,
    textAlign: "right",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 8,
    borderRadius: 6,
    gap: 8,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 6,
    overflow: "hidden",
  },
  pickerOption: {
    flex: 1,
    padding: 8,
    alignItems: "center",
  },
  pickerOptionSelected: {
    backgroundColor: "#374151",
  },
  pickerOptionText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  pickerOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
})
