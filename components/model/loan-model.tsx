
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
type LoanModalProps = {
  onClose: () => void;
};
const LoanForm: React.FC<LoanModalProps> = ({ onClose }) => {
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
  });

  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<"approvalDate" | "repaymentStartDate" | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && selectedDateField) {
      setFormData((prev) => ({ ...prev, [selectedDateField]: selectedDate }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={formData.name}
        onFocus={() => setShowNameDropdown(true)}
        onChangeText={(text) => {
          handleInputChange("name", text);
          setShowNameDropdown(false);
        }}
      />

      <Text style={styles.label}>Customer ID</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={formData.customerId}
        editable={false}
      />

      <Text style={styles.label}>Loan ID</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={formData.loanId}
        editable={false}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone"
        value={formData.phone}
        keyboardType="numeric"
        maxLength={10}
        onChangeText={(text) => handleInputChange("phone", text)}
      />

      {/* Add other fields here similarly */}

      <Text style={styles.label}>Approval Date</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedDateField("approvalDate");
          setShowDatePicker(true);
        }}
      >
        <Text style={styles.input}>{formData.approvalDate.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Repayment Start Date</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedDateField("repaymentStartDate");
          setShowDatePicker(true);
        }}
      >
        <Text style={styles.input}>{formData.repaymentStartDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData[selectedDateField || "approvalDate"]}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Repayment Method</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.repaymentMethod}
          onValueChange={(value) =>
            handleInputChange("repaymentMethod", value)
          }
        >
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Daily" value="daily" />
        </Picker>
      </View>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.paymentMethod}
          onValueChange={(value) => handleInputChange("paymentMethod", value)}
        >
          <Picker.Item label="Select method" value="" />
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Bank Transfer" value="Bank Transfer" />
          <Picker.Item label="UPI Transfer" value="Upi Transfer" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
  },
  readOnly: {
    backgroundColor: "#f0f0f0",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoanForm;
