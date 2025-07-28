"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import type React from "react"
import { useRef, useState } from "react"
import { ActivityIndicator, Clipboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"

interface OTPVerificationModalProps {
  email: string
  visible: boolean
  onClose: () => void
}

const OTPVerificationModal = ({ email, visible, onClose }:any) => {
  const navigation = useNavigation()
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRefs = useRef<(TextInput | null)[]>([])

  const handleChange = (text: string, index: number) => {
    if (isNaN(Number(text))) return

    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    // Focus next input
    if (text !== "" && index < 5) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const prevInput = inputRefs.current[index - 1]
        if (prevInput) {
          prevInput.focus()
        }
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getString()
      const pastedData = clipboardContent.slice(0, 6)

      if (/^\d+$/.test(pastedData)) {
        const newOtp = [...otp]
        for (let i = 0; i < pastedData.length && i < 6; i++) {
          newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)

        const lastIndex = Math.min(pastedData.length - 1, 5)
        const targetInput = inputRefs.current[lastIndex]
        if (targetInput) {
          targetInput.focus()
        }
      }
    } catch (error) {
      console.error("Error pasting:", error)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true)
      const otpString = otp.join("")

      // Replace with your actual API call
      const response = await fetch("/api/auth/loginOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otpString }),
      })

      const data = await response.json()

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "OTP verified successfully!",
          position: "top",
        })

        onClose()
        // navigation.navigate('Dashboard' as never)
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

  const isOtpComplete = otp.every((digit) => digit !== "")

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={48} color="#3B82F6" />
            </View>
            <Text style={styles.title}>Verify Your Identity</Text>
            <Text style={styles.subtitle}>We have sent a 6-digit code to your email</Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                 ref={(ref) => {inputRefs.current[index] = ref;}}
                  style={[styles.otpInput, digit !== "" && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus={true}
                />
              ))}
            </View>
          </View>

          {/* Paste Button */}
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Text style={styles.pasteButtonText}>Paste from clipboard</Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, (!isOtpComplete || isLoading) && styles.verifyButtonDisabled]}
            onPress={handleVerifyOtp}
            disabled={!isOtpComplete || isLoading}
          >
            <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.verifyButtonGradient}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
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
    fontSize: 16,
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#60A5FA",
    textAlign: "center",
    fontWeight: "500",
  },
  otpContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D1D5DB",
    marginBottom: 12,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    width: 48,
    height: 48,
    backgroundColor: "#374151",
    borderWidth: 2,
    borderColor: "#4B5563",
    borderRadius: 8,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  otpInputFilled: {
    borderColor: "#3B82F6",
    backgroundColor: "#1E3A8A",
  },
  pasteButton: {
    alignSelf: "center",
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pasteButtonText: {
    color: "#60A5FA",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  verifyButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
})

export default OTPVerificationModal
