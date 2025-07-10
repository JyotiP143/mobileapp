import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

const SignUpForm =() => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateAccount = () => {
    console.log("Creating account with:", formData)
    // Add your account creation logic here
  }

  const handleLogin = () => {
    console.log("Navigate to login")
      
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" /> */}
       <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="logo-electron" size={32} color="white" />
              </View>
            </View>

            {/* Header */}
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Enter your details to get started</Text>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Row 1 */}
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your Name"
                      placeholderTextColor="#666"
                      value={formData.fullName}
                      onChangeText={(value) => handleInputChange("fullName", value)}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="john@example.com"
                      placeholderTextColor="#666"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange("email", value)}
                    />
                  </View>
                </View>
              </View>

              {/* Row 2 */}
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+91 98765 43210"
                      placeholderTextColor="#666"
                      keyboardType="phone-pad"
                      value={formData.phoneNumber}
                      onChangeText={(value) => handleInputChange("phoneNumber", value)}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Company Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Company Name"
                      placeholderTextColor="#666"
                      value={formData.companyName}
                      onChangeText={(value) => handleInputChange("companyName", value)}
                    />
                  </View>
                </View>
              </View>

              {/* Row 3 */}
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="#666"
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(value) => handleInputChange("password", value)}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="#666"
                      secureTextEntry
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange("confirmPassword", value)}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={handleCreateAccount}>
              <LinearGradient
                              colors={["#667eea", "#764ba2"]}
                              style={styles.loginGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                <Text style={styles.buttonText}>Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  gradient:{ flex: 1,},
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#333",
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6366F1",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
  formFields: {
    marginBottom: 32,
  },
  row: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
       backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    height: "100%",
  },
  buttonContainer: {
    marginBottom: 24,
  },
  gradientButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#888",
  },
  loginLink: {
    fontSize: 16,
    color: "#6366F1",
    fontWeight: "600",
  },
   loginGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
})

export default SignUpForm;