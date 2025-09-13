"use client";
import OTPVerificationModal from "@/components/model/otpVerificationMode";
import { useUser } from "@/context/UserContext";
import { storeToken } from "@/utils/authToken";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type React from "react";
import { useState } from "react";
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
} from "react-native";
import Toast from "react-native-toast-message";
import { Bounce, toast } from "react-toastify";

// Types
interface LoginData {
  email: string;
  password: string;
}

type LoginScreenProps = {};

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const initialData = {
    email: "",
    password: "",
  };
  const { fetchUserData } = useUser();
  const navigation = useNavigation();
  const [loginData, setLoginData] = useState<LoginData>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  // Mock functions - replace with your actual implementations
  const verifyOwner = async (data: LoginData) => {
    // Replace with your actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          status: 200,
          message: "Login successful",
        })
      }, 2000)
    })
  }

  // const fetchUserData = async () => {
  //   // Replace with your actual user data fetching logic
  //   console.log("Fetching user data...")
  // }

  const updateData = (field: keyof LoginData, value: string) => {
    setLoginData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!loginData.email || !loginData.password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields",
        position: "top",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response: any = await verifyOwner(loginData);
      console.log("user--info---",response)
      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Logged in successfully!",
          position: "top",
        });
        storeToken(loginData.email)
        fetchUserData();
        router.push("/main");
      } else if (response?.status === 403) {
        toast.warn(response?.message || "Please verify your email!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setShowVerify(true);
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response?.message || "Invalid login credentials!",
          position: "top",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Something went wrong!",
        position: "top",
      });
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };
const handleSendOTP = async () => {
 
    if (!loginData.email) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email first",
        position: "top",
      });
      return;
    }
    try {
      setIsLoading(true);
       console.log("joidjfpo................kiiiiiiii");
      const response = await fetch(
        "https://finance.evoxcel.com/api/auth/sendOtp",
        {
          method: "POST", // change to PUT if your backend really needs it
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginData.email }),
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
         console.log("joidjfpo................kkkkkk");
        setShowOTPModal(true);
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: data.message || "Please check your email",
          position: "top",
        });
      } else {
        console.log("joidjfpo................");
        Toast.show({
          type: "error",
          text1: "Failed to Send OTP",
          text2: data.message || "Something went wrong",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not connect to server",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUp" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={[
              "rgba(59, 130, 246, 0.1)",
              "rgba(147, 51, 234, 0.1)",
              "rgba(236, 72, 153, 0.1)",
            ]}
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
              <LinearGradient
                colors={["#3B82F6", "#8B5CF6"]}
                style={styles.iconContainer}
              >
                <Ionicons name="wallet" size={32} color="white" />
              </LinearGradient>

              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Enter your credentials to access your account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TouchableOpacity
                  onPress={handleSendOTP}
                  style={styles.verifyButton}
                >
                  <Text style={styles.verifyText}>Verify Email</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    value={loginData.email}
                    onChangeText={(text) => updateData("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="#6B7280"
                    value={loginData.password}
                    onChangeText={(text) => updateData("password", text)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#3B82F6", "#8B5CF6"]}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Dont have an account?{" "}
                <Text
                  style={styles.signUpLink}
                  onPress={() => router.push("/(tabs)/signup")}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP Modal would go here - you'll need to implement this separately */}
      {showOTPModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>OTP Verification</Text>
            <Text style={styles.modalText}>
              Please check your email for the OTP code
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowOTPModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showOTPModal && <OTPVerificationModal email={loginData.email} />}
      <Toast />
    </SafeAreaView>
  );
};

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
    maxWidth: 400,
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
    color: "transparent",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  verifyButton: {
    position: "absolute",
    right: 0,
    top: 24,
  },
  verifyText: {
    fontSize: 12,
    color: "#60A5FA",
    textDecorationLine: "underline",
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
  loginButton: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  loginButtonText: {
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
  signUpLink: {
    color: "#60A5FA",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default LoginScreen;
