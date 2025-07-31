import { addLoanDetails } from "@/axios/loanApi";
import { useInvestment } from "@/context/InvestmentContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddLoanModalProps {
  onClose: () => void;
  visible: boolean;
  ownerid: string;
}

interface LoanFormData {
  name: string;
  customerId: string;
  loanId: string;
  email: string;
  phone: string;
  loanAmount: string;
  processingFee: string;
  interest: string;
  totalInstallment: string;
  installmentAmount: string;
  advancePayment: string;
  approvalDate: Date;
  repaymentStartDate: Date;
  paymentMethod: string;
  repaymentMethod: string;
  owner: string;
}

const AddLoanModal: React.FC<AddLoanModalProps> = ({ onClose, visible, ownerid }) => {
  const { setLoanData, userData, loanData } = useUser();
  const { investmentData } = useInvestment();

  const totalInvestAmount = investmentData?.investments?.reduce((sum:number, inv:any) =>{ return sum + parseFloat(inv.amount)}, 0) || 0;

  const nextCustomerId = `CUST-${(Math.max(...loanData.map(d => parseInt(d.customerId?.split('-')[1] || "1000"))) || 1000) + 1}`;
  const nextLoanId = `LN-${(Math.max(...loanData.map(d => parseInt(d.loanId?.split('-')[1] || "1000"))) || 1000) + 1}`;

  const [formData, setFormData] = useState<LoanFormData>({
    name: "",
    customerId: nextCustomerId,
    loanId: nextLoanId,
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
    owner: ownerid,
  });

  const [showApprovalPicker, setShowApprovalPicker] = useState(false);
  const [showRepaymentPicker, setShowRepaymentPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateInstallmentAmount = () => {
    const amount = parseFloat(formData.loanAmount) || 0;
    const installments = parseInt(formData.totalInstallment) || 1;
    const advance = parseFloat(formData.advancePayment) || 0;
    const interest = parseFloat(formData.interest) || 0;

    const method = formData.repaymentMethod.toLowerCase();
    let interestMultiplier = 1;

    if (method === "daily") interestMultiplier = installments / 365;
    else if (method === "weekly") interestMultiplier = installments / 52;
    else interestMultiplier = installments / 12;

    const totalInterest = ((amount * interest) / 100) * interestMultiplier;
    const principalAfterAdvance = Math.max(0, amount - advance);
    const totalPayable = principalAfterAdvance + totalInterest;

    return (totalPayable / installments).toFixed(2);
  };

  const handleChange = (key: keyof LoanFormData, value: string | Date) => {
    const updated = { ...formData, [key]: value };
    if (
      ["loanAmount", "advancePayment", "interest", "totalInstallment", "repaymentMethod"].includes(key)
    ) {
      updated.installmentAmount = calculateInstallmentAmount();
    }
    setFormData(updated);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "name", "customerId", "loanId", "phone", "loanAmount",
      "processingFee", "interest", "totalInstallment", "paymentMethod",
      "repaymentMethod",
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof LoanFormData]);

    if (missingFields.length > 0) {
      Alert.alert("Missing Fields", `Please fill all required fields.`);
      return;
    }

    if (parseFloat(formData.loanAmount) > totalInvestAmount) {
      Alert.alert("Error", "Loan amount exceeds total investment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addLoanDetails(formData) as any;
      if (res.success) {
        setLoanData((prev) => [...prev, res.data]);
        setFormData(prev => ({ ...prev, name: "", email: "", phone: "", loanAmount: "", processingFee: "", interest: "", totalInstallment: "", advancePayment: "0", installmentAmount: "0" }));
        onClose();
      } else {
        Alert.alert("Error", "Failed to add loan.");
      }
    } catch (err) {
      console.error("Loan Submit Error:", err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Add Loan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 20 }}>
            <FormInput label="Name" value={formData.name} onChangeText={(val:any) => handleChange("name", val)} />
            <FormInput label="Customer ID" value={formData.customerId} onChangeText={(val:any) => handleChange("customerId", val)} />
            <FormInput label="Loan ID" value={formData.loanId} onChangeText={(val:any) => handleChange("loanId", val)} />
            <FormInput label="Email" value={formData.email} onChangeText={(val:any) => handleChange("email", val)} keyboardType="email-address" />
            <FormInput label="Phone" value={formData.phone} onChangeText={(val:any) => handleChange("phone", val)} keyboardType="number-pad" />
            <FormInput label="Loan Amount" value={formData.loanAmount} onChangeText={(val:any) => handleChange("loanAmount", val)} keyboardType="numeric" />
            <FormInput label="Processing Fee" value={formData.processingFee} onChangeText={(val:any) => handleChange("processingFee", val)} keyboardType="numeric" />
            <FormInput label="Interest (%)" value={formData.interest} onChangeText={(val:any) => handleChange("interest", val)} keyboardType="numeric" />
            <FormInput label="Total Installment" value={formData.totalInstallment} onChangeText={(val:any) => handleChange("totalInstallment", val)} keyboardType="numeric" />
            <FormInput label="Advance Payment" value={formData.advancePayment} onChangeText={(val:any) => handleChange("advancePayment", val)} keyboardType="numeric" />
            <FormInput label="Installment Amount" value={formData.installmentAmount} editable={false} />

            <DatePicker label="Approval Date" value={formData.approvalDate} onChange={(date:any) => handleChange("approvalDate", date)} />
            <DatePicker label="Repayment Start Date" value={formData.repaymentStartDate} onChange={(date:any) => handleChange("repaymentStartDate", date)} />

            <FormInput label="Payment Method" value={formData.paymentMethod} onChangeText={(val:any) => handleChange("paymentMethod", val)} />
            <FormInput label="Repayment Method" value={formData.repaymentMethod} onChangeText={(val:any) => handleChange("repaymentMethod", val)} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} disabled={isSubmitting}>
              <Text style={styles.btnText}>{isSubmitting ? "Submitting..." : "Submit"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FormInput = ({ label, value, onChangeText,customerId,loanId, editable = true, keyboardType = "default" }:any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && { backgroundColor: "#f2f2f2" }]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      keyboardType={keyboardType}
    />
  </View>
);

const DatePicker = ({ label, value, onChange }:any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity onPress={() => onChange(new Date())} style={styles.datePicker}>
      <Text>{format(value, "PPP")}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", width: "90%", borderRadius: 10, maxHeight: "90%" },
  header: { backgroundColor: "#2563eb", padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  formContainer: { paddingHorizontal: 16 },
  inputContainer: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
  datePicker: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
  footer: { flexDirection: "row", justifyContent: "flex-end", padding: 16 },
  cancelBtn: { backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginRight: 10 },
  submitBtn: { backgroundColor: "#22c55e", padding: 10, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "600" },
});

export default AddLoanModal;
