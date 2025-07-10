
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const passsignup = ()=>{
  router.push('/signup')
}
  const [email, setEmail] = useState("JyoPrash");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {


    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Handle login logic here
    console.log("Login attempt:", { email, password });
    Alert.alert("Success", "Login functionality would be implemented here");
  };

  const handleSocialLogin = (provider: any) => {
    Alert.alert(`Social Login ${provider} login would be implemented here`);
  };

  const mydashboard = () => {
    router.push("/main/app");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="lock-closed" size={32} color="#fff" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to your account to continue
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.loginGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText} onPress={mydashboard}>
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Dont have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.signupLink} onPress={passsignup}>Sign up here</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our{" "}
                <Text style={styles.footerLink}>Terms of Service</Text>
                {" and "}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
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
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  eyeIcon: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  rememberText: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: "#9CA3AF",
    paddingHorizontal: 16,
    textTransform: "uppercase",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    marginHorizontal: 6,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  footer: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  footerLink: {
    color: "#fff",
    fontWeight: "600",
  },
});
export default LoginScreen;



// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { router } from "expo-router";

// const { width, height } = Dimensions.get("window");

// export default function App() {
//   const scedule = () => {
//     router.push("/sceduleDemo");
//   };
//   const loginpage = () => {
//     router.push("/login");
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       {/* Header/Navigation */}
//       <View style={styles.header}>
//         <View style={styles.logo}>
//           <View style={styles.logoIcon}>
//             <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
//           </View>
//           <Text style={styles.logoText}>EvoXcel</Text>
//         </View>

//         <View style={styles.navigation}>
//           <TouchableOpacity style={styles.loginButton} onPress={loginpage}>
//             <Text style={styles.loginText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.demoButton}>
//             <LinearGradient
//               colors={["#4F46E5", "#7C3AED"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.demoButtonGradient}
//             >
//               <Text style={styles.demoButtonText} onPress={scedule}>
//                 Schedule Demo
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Main Content */}
//       <View style={styles.mainContent}>
//         <View style={styles.heroSection}>
//           {/* Gradient Heading */}
//           <View style={styles.headingContainer}>
//             <LinearGradient
//               colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.gradientText}
//             >
//               <Text style={styles.heading}>Secure & Transparent</Text>
//             </LinearGradient>
//             <LinearGradient
//               colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.gradientText}
//             >
//               <Text style={styles.heading}>Chit Fund Management</Text>
//             </LinearGradient>
//           </View>

//           {/* Subtitle */}
//           <Text style={styles.subtitle}>
//             Streamline your chit fund operations with our comprehensive
//             platform. Manage members, track payments, and grow your business
//             with ease.
//           </Text>

//           {/* CTA Button */}
//           <TouchableOpacity style={styles.ctaButton}>
//             <LinearGradient
//               colors={["#4F46E5", "#7C3AED"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.ctaButtonGradient}
//             >
//               <Text style={styles.ctaButtonText} onPress={scedule}>
//                 Schedule Demo
//               </Text>
//               <Ionicons
//                 name="arrow-forward"
//                 size={20}
//                 color="#FFFFFF"
//                 style={styles.ctaArrow}
//               />
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#1F1F1F",
//   },
//   logo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logoIcon: {
//     marginRight: 8,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   navigation: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   loginButton: {
//     marginRight: 16,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   loginText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   demoButton: {
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   demoButtonGradient: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   demoButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   heroSection: {
//     alignItems: "center",
//     maxWidth: width * 0.9,
//   },
//   headingContainer: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   gradientText: {
//     borderRadius: 4,
//   },
//   heading: {
//     fontSize: width > 400 ? 48 : 36,
//     fontWeight: "800",
//     textAlign: "center",
//     color: "white",
//     lineHeight: width > 400 ? 56 : 42,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: "#9CA3AF",
//     textAlign: "center",
//     lineHeight: 28,
//     marginBottom: 40,
//     maxWidth: width * 0.8,
//   },
//   ctaButton: {
//     borderRadius: 12,
//     overflow: "hidden",
//     elevation: 4,
//     shadowColor: "#4F46E5",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   ctaButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//   },
//   ctaButtonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   ctaArrow: {
//     marginLeft: 8,
//   },
// });

