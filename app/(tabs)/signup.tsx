"use client"

import { useUser } from "@/context/UserContext"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import type React from "react"
import { useState } from "react"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Toast from "react-native-toast-message"
// Types
interface FormData {
  name: string
  email: string
  phone: string
  companyName: string
  password: string
}

const SignUpScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
  })
    const router = useRouter();
  const { fetchUserData } = useUser();
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const navigation = useNavigation()

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSignup = async () => {
    if (formData.password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "The passwords entered do not match!",
        position: "top",
      })
      return
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.companyName || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields",
        position: "top",
      })
      return
    }

    try {
      setIsLoading(true)

      // Replace with your actual API call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Account created successfully!",
          position: "top",
        })
        setStep(2)
         fetchUserData();
        router.push("/main");
      } else {
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2: data.message || "Failed to create account",
          position: "top",
        })
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during signup",
        position: "top",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Missing OTP",
        text2: "Please enter the OTP code",
        position: "top",
      })
      return
    }

    try {
      setIsLoading(true)

      // Replace with your actual API call
      const response = await fetch("/api/auth/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Account verified successfully!",
          position: "top",
        })

        // Navigate to dashboard
        navigation.navigate("Dashboard" as never)
      } else {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: data.message || "Invalid OTP code",
          position: "top",
        })
      }
    } catch (error) {
      console.error("OTP Verification Error:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during OTP verification",
        position: "top",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigation.navigate("Login" as never)
  }

  const renderSignupForm = () => (
    <View style={styles.form}>
      {/* Name and Email Row */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Name"
              placeholderTextColor="#6B7280"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#6B7280"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      {/* Phone and Company Row */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor="#6B7280"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Company Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Company Name"
              placeholderTextColor="#6B7280"
              value={formData.companyName}
              onChangeText={(text) => handleInputChange("companyName", text)}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>

      {/* Password Row */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Create a password"
              placeholderTextColor="#6B7280"
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm your password"
              placeholderTextColor="#6B7280"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.submitButtonGradient}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderOtpForm = () => (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>OTP</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="shield-checkmark" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#6B7280"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleVerifyOtp}
        disabled={isLoading}
      >
        <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.submitButtonGradient}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Verify OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Background Gradient */}
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.1)", "rgba(147, 51, 234, 0.1)", "rgba(236, 72, 153, 0.1)"]}
            style={styles.backgroundGradient}
          />

          {/* Animated Gradient Orbs */}
          <View style={styles.orbContainer}>
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.1)"]}
              style={[styles.orb, styles.orb1]}
            />
            <LinearGradient
              colors={["rgba(147, 51, 234, 0.3)", "rgba(147, 51, 234, 0.1)"]}
              style={[styles.orb, styles.orb2]}
            />
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.iconContainer}>
                <Ionicons name="wallet" size={32} color="white" />
              </LinearGradient>

              <Text style={styles.title}>{step === 1 ? "Create an account" : "Verify OTP"}</Text>
              <Text style={styles.subtitle}>
                {step === 1 ? "Enter your details to get started" : "Enter the OTP sent to your email"}
              </Text>
            </View>

            {/* Form Content */}
            {step === 1 ? renderSignupForm() : renderOtpForm()}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.loginLink} onPress={() => router.push("/(tabs)")}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orbContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orb: {
    position: "absolute",
    width: 288,
    height: 288,
    borderRadius: 144,
  },
  orb1: {
    top: -16,
    left: -16,
  },
  orb2: {
    bottom: -16,
    right: -16,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 24,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "500",
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  loginLink: {
    color: "#60A5FA",
    fontWeight: "500",
  },
})

export default SignUpScreen
