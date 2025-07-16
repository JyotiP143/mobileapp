import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

export const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.text}>Loading loans...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
})
