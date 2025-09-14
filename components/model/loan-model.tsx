import { addLoanDetails } from "@/axios/loanApi";
import { useInvestment } from "@/context/InvestmentContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Platform } from "react-native";

import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "react-toastify";

interface AddLoanModalProps {
  onClose: () => void;
  visible: boolean;
  ownerid: string;
}

const AddLoanModal: React.FC<AddLoanModalProps> = ({
  onClose,
  visible,
  ownerid,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { setLoanData, userData, loanData } = useUser();

  const [showApprovalDatePicker, setShowApprovalDatePicker] =
    useState<boolean>(false);
    const [showRepaymentDatePicker,setShowRepaymentDatePicker]=
    useState<boolean>(false);
  const { investmentData } = useInvestment();
  let loanCustId = loanData.map((item) => item.customerId);
  let loanIds = loanData.map((item) => item.loanId);
  let loanName = loanData.map((item) => {
    return {
      name: item.name,
      custId: item.customerId,
      phone: item.phone,
    };
  });
  const totalInvestAmount = investmentData?.investments?.length
    ? investmentData.investments.reduce(
        (total: number, invest: any) => total + parseInt(invest.amount, 10),
        0
      )
    : 0;
  const nextCustomerId =
    loanCustId.length > 0
      ? Math.max(...loanCustId.map((id) => parseInt(id.replace("CUST-", "")))) +
        1
      : 1001;
  const nextLoanId =
    loanIds.length > 0
      ? Math.max(...loanIds.map((id) => parseInt(id.replace("LN-", "")))) + 1
      : 1001;

  const userIdString = String(userData.id);
  let intialData = {
    name: "",
    customerId: `CUST-${nextCustomerId}`,
    loanId: `LN-${nextLoanId}`,
    email: "",
    phone: "",
    loanAmount: "",
    processingFee: "",
    interest: "",
    totalInstallment: "",
    installmentAmount: "",
    advancePayment: "0",
    approvalDate: new Date(),
    repaymentStartDate: new Date(),
    paymentMethod: "",
    repaymentMethod: "monthly",
    owner: userIdString,
  };
  const [formData, setFormData] = useState(intialData);
  const calculateInstallmentAmount = () => {
    const amount = parseFloat(formData.loanAmount) || 0;
    const installments = parseInt(formData.totalInstallment) || 1;
    const advance = parseFloat(formData.advancePayment) || 0;
    const interest = parseFloat(formData.interest) || 0;
    const method = formData.repaymentMethod;

    const principalAfterAdvance = Math.max(0, amount - advance);
    let yearlyRate = 0;
    let interestMultiplier = 1;
    switch (method.toLowerCase()) {
      case "daily":
        yearlyRate = interest * 365;
        interestMultiplier = installments / 365;
        break;
      case "weekly":
        yearlyRate = interest * 52;
        interestMultiplier = installments / 52;
        break;
      case "monthly":
        yearlyRate = interest * 12;
        interestMultiplier = installments / 12;
        break;
      default:
        yearlyRate = interest;
        interestMultiplier = installments / 1;
        break;
    }
    const totalInterestAmount =
      ((amount * yearlyRate) / 100) * interestMultiplier;
    const totalWithInterest = principalAfterAdvance;
    const installmentAmount = totalWithInterest / installments;
    return {
      installmentAmount: parseFloat(installmentAmount.toFixed(2)),
      yearlyRate: parseFloat(yearlyRate.toFixed(2)),
      totalInterestAmount: parseFloat(totalInterestAmount.toFixed(2)),
    };
  };
  const generateEmiHistory = ({
    startDate,
    repaymentMethod,
    totalInstallments,
    advancePayment,
  }: any) => {
    const emiHistory = [];
    const { installmentAmount } = calculateInstallmentAmount();
    if (advancePayment > 0) {
      emiHistory.push({
        date: new Date(),
        amount: advancePayment.toFixed(2),
        transactionId: "AdvPay",
        paidDate: new Date(startDate).toISOString().split("T")[0],
        paidStatus: "Paid",
      });
    }

    let currentDate = new Date(startDate);

    for (let i = 1; i <= totalInstallments; i++) {
      emiHistory.push({
        date: currentDate.toLocaleDateString("en-CA"),
        amount: installmentAmount.toFixed(2),
        transactionId: `TXN${i.toString().padStart(5, "0")}`,
        paidDate: null,
        paidStatus: "Due",
      });
      switch (repaymentMethod) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    return emiHistory;
  };

  const handleSelectName = ({ name, id, phone }: any) => {
    handleInputChange("name", name);
    handleInputChange("customerId", id);
    handleInputChange("phone", phone);
    setShowDropdown(false);
  };
  const { installmentAmount, yearlyRate, totalInterestAmount } =
    calculateInstallmentAmount();
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      calculateInstallmentAmount();
      const { installmentAmount } = calculateInstallmentAmount();
      const emiHistory =
        newData.repaymentStartDate &&
        newData.repaymentMethod &&
        newData.totalInstallment
          ? generateEmiHistory({
              startDate: new Date(newData.repaymentStartDate),
              repaymentMethod: newData.repaymentMethod,
              totalInstallments: parseInt(newData.totalInstallment),
              advancePayment: parseFloat(newData.advancePayment) || 0,
            })
          : [];
      return {
        ...newData,
        installmentAmount: installmentAmount.toString(),
        emiHistory,
      };
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//   setIsSubmitting(true);
//   console.log("submit ....sbubmit..............................");

//   // ✅ Step 1: Get ownerid from localStorage (or Context)
//   const ownerid = localStorage.getItem("ownerid") || "";
// console.log("ownerid.." ,ownerid ,ownerid)
//   // ✅ Step 2: Safeguard → prevent empty ownerid
//   if (!ownerid) {
//     toast.error("Owner ID is missing. Please log in again.", {
//       position: "top-center",
//       autoClose: 2000,
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   // ✅ Step 3: Validate required fields
//   const requiredFields = [
//     "name",
//     "customerId",
//     "loanId",
//     "phone",
//     "loanAmount",
//     "processingFee",
//     "interest",
//     "totalInstallment",
//     "installmentAmount",
//     "advancePayment",
//     "approvalDate",
//     "repaymentStartDate",
//     "paymentMethod",
//     "repaymentMethod",
//   ];

//   const missingFields = requiredFields.filter(
//     (field) => !formData[field as keyof typeof formData]
//   );

//   if (missingFields.length > 0) {
//     toast.error(
//       `Please fill all required fields: ${missingFields.join(", ")}`,
//       { position: "top-center", autoClose: 1500 }
//     );
//     setIsSubmitting(false);
//     return;
//   }

//   // ✅ Step 4: Build payload with ownerid
//   const payload = {
//     ...formData,
//     paymentMethod: formData.paymentMethod || "cash",
//     owner: ownerid,
//   };

//   console.log("Owner ID:", ownerid);
//   console.log("Payload being submitted:", payload);

//   // ✅ Step 5: API call
//   try {
//     if (totalInvestAmount < formData.loanAmount) {
//       toast.error("Investment amount is less than the loan amount...", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//     } else {
//       const response = await addLoanDetails(payload);
//       if (response.success) {
//         setLoanData((prevLoans) =>
//           Array.isArray(prevLoans) ? [...prevLoans, response.data] : [response.data]
//         );
//         setFormData(intialData);
//         toast.success("Loan added successfully!", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//         onClose();
//       } else {
//         toast.error(response.message || "Failed to submit loan data", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error submitting loan data:", error);
//     toast.error("An unexpected error occurred", {
//       position: "top-center",
//       autoClose: 2000,
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };


  const handleSubmit = async () => {
  setIsSubmitting(true);
  console.log("submit ....sbubmit..............................");
  // ✅ Step 1: Get ownerid from localStorage (or Context)
  const ownerid = localStorage.getItem("ownerid") || "";
console.log("ownerid.." ,ownerid ,ownerid)
  // ✅ Step 2: Safeguard → prevent empty ownerid
  if (!ownerid) {
    toast.error("Owner ID is missing. Please log in again.", {
      position: "top-center",
      autoClose: 2000,
    });
    setIsSubmitting(false);
    return;
  }
  const requiredFields = [
    "name",
    "customerId",
    "loanId",
    "phone",
    "loanAmount",
    "processingFee",
    "interest",
    "totalInstallment",
    "installmentAmount",
    "advancePayment",
    "approvalDate",
    "repaymentStartDate",
    "paymentMethod",
    "repaymentMethod",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field as keyof typeof formData]
  );

  if (missingFields.length > 0) {
    toast.error(
      `Please fill all required fields: ${missingFields.join(", ")}`,
      { position: "top-center", autoClose: 1500 }
    );
    setIsSubmitting(false);
    return;
  }

  const payload = {
    ...formData,
    paymentMethod: formData.paymentMethod || "cash",
    owner: ownerid,
  
  };
  console.log("  console.log(owner)",ownerid)
  console.log("Payload being submitted:", payload);

  try {
    if (totalInvestAmount < formData.loanAmount) {
      toast.error("Investment amount is less than the loan amount...", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      const response = await addLoanDetails(payload); // ✅ fixed
      if (response.success) {
        setLoanData((prevLoans) =>
          Array.isArray(prevLoans) ? [...prevLoans, response.data] : [response.data]
        );
        setFormData(intialData);
        toast.success("Loan added successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        onClose();
      } else {
        toast.error("Failed to submit loan data", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  } catch (error) {
    console.error("Error submitting loan data:", error);
    toast.error("An unexpected error occurred", {
      position: "top-center",
      autoClose: 2000,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Loan Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Name Field with Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <TextInput
                  style={styles.input}
                  placeholder="Select or Enter Name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  editable={!showDropdown}
                />
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={loanName.filter(
                      (item, index, self) =>
                        index ===
                        self.findIndex((t) => t.custId === item.custId)
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectName(item.name)}
                        // , item.custId, item.phone
                        style={styles.dropdownList}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Customer ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Customer ID <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={formData.customerId}
                placeholder="CUST-1001"
                editable={false}
              />
            </View>

            {/* Loan ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Loan ID <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                placeholder="LN-85954"
                value={formData.loanId}
                editable={false}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the Email"
                value={formData.email}
                onChangeText={(text) =>
                  handleInputChange("email", text.toLowerCase())
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Phone <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Loan Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Loan Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Loan Amount"
                value={formData.loanAmount}
                onChangeText={(text) => handleInputChange("loanAmount", text)}
                keyboardType="numeric"
              />
            </View>

            {/* Processing Fee */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Processing Fee (In Amount){" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Processing Fee"
                value={formData.processingFee}
                onChangeText={(text) =>
                  handleInputChange("processingFee", text)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Interest */}
            <View style={styles.inputGroup}>
              <View style={styles.interestHeader}>
                <Text style={styles.label}>
                  Interest (%) <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.label}>Interest Amount</Text>
              </View>
              <View style={styles.interestRow}>
                <TextInput
                  style={[styles.input, styles.interestInput]}
                  placeholder="Enter Interest Rate"
                  value={formData.interest}
                  onChangeText={(text) => handleInputChange("interest", text)}
                  keyboardType="numeric"
                />
                <View style={[styles.input, styles.interestAmountDisplay]}>
                  <Text style={styles.interestAmountText}>
                    {totalInterestAmount}
                  </Text>
                </View>
              </View>
              <Text style={styles.interestInfo}>
                Yearly Interest: {formData.interest} x{" "}
                {formData.repaymentMethod === "monthly"
                  ? "12"
                  : formData.repaymentMethod === "weekly"
                  ? "52"
                  : "365"}{" "}
                = {yearlyRate}%
              </Text>
            </View>

            {/* Repayment Method */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Repayment Method <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.repaymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("repaymentMethod", value)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Monthly" value="monthly" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Daily" value="daily" />
                </Picker>
              </View>
            </View>

            {/* Total Installment */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Total Installment <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Total Installment"
                value={formData.totalInstallment}
                onChangeText={(text) =>
                  handleInputChange("totalInstallment", text)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Advance Payment */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Advance Payment</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Advance Payment"
                value={formData.advancePayment}
                onChangeText={(text) =>
                  handleInputChange("advancePayment", text)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Installment Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Installment Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={formData.installmentAmount}
                editable={false}
              />
            </View>

            {/* Approval Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Loan Approval Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowApprovalDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={styles.dateButtonText}>
                  {formData.approvalDate.toLocaleDateString("en-CA")}
                </Text>
              </TouchableOpacity>
              {showApprovalDatePicker && (
                <DateTimePicker
                  value={formData.approvalDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowApprovalDatePicker(Platform.OS === "ios");
                  //   if (selectedDate) {
                  //     handleInputChange("approvalDate", selectedDate);
                  //   }
                   }
                  }
                />
              )}
            </View>

            {/* Repayment Start Date */}
           <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Repayment Start Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowRepaymentDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={styles.dateButtonText}>{formData.repaymentStartDate.toLocaleDateString("en-CA")}</Text>
              </TouchableOpacity>
              {showRepaymentDatePicker && (
                <DateTimePicker
                  value={formData.repaymentStartDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowRepaymentDatePicker(Platform.OS === "ios")
                    // if (selectedDate) {
                    //   handleInputChange("repaymentStartDate", selectedDate)
                    // }
                  }}
                />
              )}
            </View> 

            {/* Payment Method */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Payment Method <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select payment method" value="" />
                  <Picker.Item label="Cash" value="Cash" />
                  <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                  <Picker.Item label="UPI Transfer" value="Upi Transfer" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  readOnlyInput: {
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    maxHeight: 160,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownList: {
    maxHeight: 160,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
    textTransform: "capitalize",
  },
  interestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  interestRow: {
    flexDirection: "row",
    gap: 8,
  },
  interestInput: {
    flex: 1,
  },
  interestAmountDisplay: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
  },
  interestAmountText: {
    fontSize: 16,
    color: "#374151",
  },
  interestInfo: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#16A34A",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default AddLoanModal;
