import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

const Sceduledemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Check if all fields are filled
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData].trim()
    );

    if (emptyFields.length > 0) {
      Alert.alert(
        "Error",
        "All fields are mandatory. Please fill in all required fields."
      );
      return;
    }

    Alert.alert("Success", "Form submitted successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>
            Please fill in all the required fields
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your state"
              value={formData.state}
              onChangeText={(value) => handleInputChange("state", value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ZIP Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your ZIP code"
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange("zipCode", value)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your country"
              value={formData.country}
              onChangeText={(value) => handleInputChange("country", value)}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Sceduledemo;
