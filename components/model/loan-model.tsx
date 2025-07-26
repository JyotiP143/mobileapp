"use client"

import { MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { LinearGradient } from "expo-linear-gradient"
import type React from "react"
import { useState } from "react"
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")

type LoanModalProps = {
  onClose: () => void
}

const LoanForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    customerId: "CUST-1001",
    loanId: "LN-1001",
    email: "",
    phone: "",
    loanAmount: "",
    processingFee: "",
    interest: "",
    totalInstallment: "",
    installmentAmount: "0",
    advancePayment: "0",
    approvalDate: new Date(),
    repaymentStartDate: new Date(),
    paymentMethod: "",
    repaymentMethod: "monthly",
  })

  const [showNameDropdown, setShowNameDropdown] = useState(false)
  const [selectedDateField, setSelectedDateField] = useState<"approvalDate" | "repaymentStartDate" | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate && selectedDateField) {
      setFormData((prev) => ({ ...prev, [selectedDateField]: selectedDate }))
    }
  }

  return (
    <LinearGradient colors={["#0f172a", "#1e293b", "#334155"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.headerIcon}>
            <MaterialIcons name="add-business" size={24} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Loan Application</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person-outline" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onFocus={() => setShowNameDropdown(true)}
                onChangeText={(text) => {
                  handleInputChange("name", text)
                  setShowNameDropdown(false)
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer ID</Text>
            <View style={[styles.inputContainer, styles.readOnlyContainer]}>
              <MaterialIcons name="badge" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput style={[styles.input, styles.readOnly]} value={formData.customerId} editable={false} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan ID</Text>
            <View style={[styles.inputContainer, styles.readOnlyContainer]}>
              <MaterialIcons name="credit-card" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput style={[styles.input, styles.readOnly]} value={formData.loanId} editable={false} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Phone"
                placeholderTextColor="#9ca3af"
                value={formData.phone}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>
          </View>
        </View>

        {/* Loan Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="account-balance" size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Loan Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Loan Amount <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="attach-money" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Loan Amount"
                placeholderTextColor="#9ca3af"
                value={formData.loanAmount}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("loanAmount", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Processing Fee <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="receipt" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Processing Fee"
                placeholderTextColor="#9ca3af"
                value={formData.processingFee}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("processingFee", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Interest (%) <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="trending-up" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Interest Rate"
                placeholderTextColor="#9ca3af"
                value={formData.interest}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("interest", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Total Installment <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="format-list-numbered" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Total Installment"
                placeholderTextColor="#9ca3af"
                value={formData.totalInstallment}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("totalInstallment", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Installment Amount</Text>
            <View style={[styles.inputContainer, styles.readOnlyContainer]}>
              <MaterialIcons name="calculate" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.readOnly]}
                value={`₹${formData.installmentAmount}`}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Advance Payment</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="payment" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Advance Payment"
                placeholderTextColor="#9ca3af"
                value={formData.advancePayment}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("advancePayment", text)}
              />
            </View>
          </View>
        </View>

        {/* Schedule & Payment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="schedule" size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Schedule & Payment</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Approval Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setSelectedDateField("approvalDate")
                setShowDatePicker(true)
              }}
            >
              <MaterialIcons name="event" size={20} color="#6366f1" />
              <Text style={styles.dateText}>{formData.approvalDate.toDateString()}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Repayment Start Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setSelectedDateField("repaymentStartDate")
                setShowDatePicker(true)
              }}
            >
              <MaterialIcons name="event" size={20} color="#6366f1" />
              <Text style={styles.dateText}>{formData.repaymentStartDate.toDateString()}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData[selectedDateField || "approvalDate"]}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Repayment Method <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <MaterialIcons name="schedule" size={20} color="#6366f1" style={styles.pickerIcon} />
              <Picker
                selectedValue={formData.repaymentMethod}
                onValueChange={(value) => handleInputChange("repaymentMethod", value)}
                style={styles.picker}
                dropdownIconColor="#ffffff"
              >
                <Picker.Item label="Monthly" value="monthly" color="#ffffff" />
                <Picker.Item label="Weekly" value="weekly" color="#ffffff" />
                <Picker.Item label="Daily" value="daily" color="#ffffff" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Payment Method <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <MaterialIcons name="payment" size={20} color="#6366f1" style={styles.pickerIcon} />
              <Picker
                selectedValue={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                style={styles.picker}
                dropdownIconColor="#ffffff"
              >
                <Picker.Item label="Select method" value="" color="#ffffff" />
                <Picker.Item label="Cash" value="Cash" color="#ffffff" />
                <Picker.Item label="Bank Transfer" value="Bank Transfer" color="#ffffff" />
                <Picker.Item label="UPI Transfer" value="Upi Transfer" color="#ffffff" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <LinearGradient colors={["#10b981", "#059669"]} style={styles.submitGradient}>
            <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            <Text style={styles.submitText}>Submit Application</Text>
          </LinearGradient>
        </TouchableOpacity>
         <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
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
  section: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  readOnlyContainer: {
    backgroundColor: "rgba(107, 114, 128, 0.3)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 12,
  },
  readOnly: {
    color: "#9ca3af",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 12,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingLeft: 16,
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    color: "#ffffff",
    height: 50,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
})

export default LoanForm
